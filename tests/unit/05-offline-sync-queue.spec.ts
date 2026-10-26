import { OfflineSyncQueue } from '../../client/lib/offline-queue';

describe('Suite 05: Offline Sync Queue & Resilient Mutation Manager', () => {
  let queue: OfflineSyncQueue;

  beforeEach(() => {
    queue = new OfflineSyncQueue(3, 1000); // 3 max retries, 1000ms base backoff
  });

  describe('Queue Ingestion & Deduplication', () => {
    it('should enqueue a new bookmark mutation with pending status and retryCount 0', () => {
      const mutation = queue.enqueue('bookmark', 'opp_123', { folder: 'AI Research' });

      expect(mutation.id).toMatch(/^mut_\d+_[a-z0-9]+$/);
      expect(mutation.action).toBe('bookmark');
      expect(mutation.targetId).toBe('opp_123');
      expect(mutation.payload).toEqual({ folder: 'AI Research' });
      expect(mutation.status).toBe('pending');
      expect(mutation.retryCount).toBe(0);
      expect(queue.size()).toBe(1);
    });

    it('should deduplicate pending mutations for the same action and targetId by updating payload', () => {
      const mut1 = queue.enqueue('note', 'opp_456', { text: 'Drafting note v1' });
      const mut2 = queue.enqueue('note', 'opp_456', { text: 'Drafting note v2', urgent: true });

      expect(queue.size()).toBe(1);
      expect(mut1.id).toBe(mut2.id);
      expect(mut2.payload).toEqual({ text: 'Drafting note v2', urgent: true });
    });

    it('should allow multiple mutations for different actions or targets', () => {
      queue.enqueue('bookmark', 'opp_001');
      queue.enqueue('apply', 'opp_001');
      queue.enqueue('bookmark', 'opp_002');

      expect(queue.size()).toBe(3);
    });
  });

  describe('FIFO Ordering & Inspection', () => {
    it('should return pending mutations ordered chronologically', async () => {
      queue.enqueue('bookmark', 'opp_first');
      // small delay to guarantee timestamp difference
      await new Promise((resolve) => setTimeout(resolve, 10));
      queue.enqueue('bookmark', 'opp_second');

      const pending = queue.getPending();
      expect(pending.length).toBe(2);
      expect(pending[0].targetId).toBe('opp_first');
      expect(pending[1].targetId).toBe('opp_second');
    });
  });

  describe('Exponential Backoff Delay Calculations', () => {
    it('should compute baseBackoff * 2^retryCount exponential delay', () => {
      expect(queue.calculateBackoffDelay(0)).toBe(1000); // 1000 * 2^0 = 1000ms
      expect(queue.calculateBackoffDelay(1)).toBe(2000); // 1000 * 2^1 = 2000ms
      expect(queue.calculateBackoffDelay(2)).toBe(4000); // 1000 * 2^2 = 4000ms
      expect(queue.calculateBackoffDelay(3)).toBe(8000); // 1000 * 2^3 = 8000ms
    });
  });

  describe('Result Handling, Retries & Purging', () => {
    it('should mark mutation as synced when processing succeeds', () => {
      const mut = queue.enqueue('apply', 'opp_999');
      const updated = queue.handleResult(mut.id, true);

      expect(updated.status).toBe('synced');
      expect(queue.getPending().length).toBe(0);
    });

    it('should retry up to maxRetries on failure, transitioning to failed thereafter', () => {
      const mut = queue.enqueue('bookmark', 'opp_fail');

      // Attempt 1 failure
      const r1 = queue.handleResult(mut.id, false);
      expect(r1.retryCount).toBe(1);
      expect(r1.status).toBe('pending');

      // Attempt 2 failure
      const r2 = queue.handleResult(mut.id, false);
      expect(r2.retryCount).toBe(2);
      expect(r2.status).toBe('pending');

      // Attempt 3 failure (maxRetries reached)
      const r3 = queue.handleResult(mut.id, false);
      expect(r3.retryCount).toBe(3);
      expect(r3.status).toBe('failed');
    });

    it('should throw an error when handling result for a non-existent mutation ID', () => {
      expect(() => queue.handleResult('non_existent_id', true)).toThrow(
        'Mutation with ID non_existent_id not found in queue'
      );
    });

    it('should purge only synced mutations and retain pending or failed items', () => {
      const m1 = queue.enqueue('bookmark', 'opp_1');
      const m2 = queue.enqueue('bookmark', 'opp_2');
      const m3 = queue.enqueue('bookmark', 'opp_3');

      queue.handleResult(m1.id, true); // synced
      queue.handleResult(m2.id, false); // retry 1, pending
      // m3 remains pending

      expect(queue.size()).toBe(3);
      const purgedCount = queue.purgeSynced();

      expect(purgedCount).toBe(1);
      expect(queue.size()).toBe(2);
      expect(queue.getPending().length).toBe(2);
    });

    it('should clear all items when clear() is invoked', () => {
      queue.enqueue('bookmark', 'opp_1');
      queue.enqueue('apply', 'opp_2');
      expect(queue.size()).toBe(2);

      queue.clear();
      expect(queue.size()).toBe(0);
      expect(queue.getPending()).toEqual([]);
    });
  });
});
