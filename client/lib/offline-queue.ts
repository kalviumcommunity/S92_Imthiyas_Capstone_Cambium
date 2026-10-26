/**
 * Cambium Offline Sync Queue & Mutation Manager
 * Manages optimistic mutations, retry backoff, and state synchronization for resilient scholars.
 */

export interface QueuedMutation {
  id: string;
  action: 'bookmark' | 'apply' | 'note' | 'match';
  targetId: string;
  payload: Record<string, any>;
  timestamp: number;
  retryCount: number;
  status: 'pending' | 'processing' | 'failed' | 'synced';
}

export class OfflineSyncQueue {
  private queue: QueuedMutation[] = [];
  private maxRetries: number;
  private baseBackoffMs: number;

  constructor(maxRetries = 3, baseBackoffMs = 1000) {
    this.maxRetries = maxRetries;
    this.baseBackoffMs = baseBackoffMs;
  }

  /**
   * Enqueues a new mutation.
   * If a pending mutation with the same action and targetId exists, it updates payload and resets retryCount (deduplication).
   */
  public enqueue(
    action: QueuedMutation['action'],
    targetId: string,
    payload: Record<string, any> = {}
  ): QueuedMutation {
    const existingIndex = this.queue.findIndex(
      (m) => m.action === action && m.targetId === targetId && m.status === 'pending'
    );

    if (existingIndex !== -1) {
      this.queue[existingIndex].payload = {
        ...this.queue[existingIndex].payload,
        ...payload,
      };
      this.queue[existingIndex].timestamp = Date.now();
      return this.queue[existingIndex];
    }

    const mutation: QueuedMutation = {
      id: `mut_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      action,
      targetId,
      payload,
      timestamp: Date.now(),
      retryCount: 0,
      status: 'pending',
    };

    this.queue.push(mutation);
    return mutation;
  }

  /**
   * Returns all pending mutations sorted by creation timestamp (FIFO).
   */
  public getPending(): QueuedMutation[] {
    return this.queue
      .filter((m) => m.status === 'pending')
      .sort((a, b) => a.timestamp - b.timestamp);
  }

  /**
   * Computes the exponential backoff delay in milliseconds for a given retry attempt.
   */
  public calculateBackoffDelay(retryCount: number): number {
    return this.baseBackoffMs * Math.pow(2, retryCount);
  }

  /**
   * Records a processing result for a mutation:
   * - If success: marks as 'synced'
   * - If failure and retryCount < maxRetries: increments retryCount and keeps 'pending'
   * - If failure and retryCount >= maxRetries: marks as 'failed'
   */
  public handleResult(id: string, success: boolean): QueuedMutation {
    const mutation = this.queue.find((m) => m.id === id);
    if (!mutation) {
      throw new Error(`Mutation with ID ${id} not found in queue`);
    }

    if (success) {
      mutation.status = 'synced';
    } else {
      mutation.retryCount += 1;
      if (mutation.retryCount >= this.maxRetries) {
        mutation.status = 'failed';
      } else {
        mutation.status = 'pending';
      }
    }

    return mutation;
  }

  /**
   * Purges successfully synced mutations to free memory.
   */
  public purgeSynced(): number {
    const initialLen = this.queue.length;
    this.queue = this.queue.filter((m) => m.status !== 'synced');
    return initialLen - this.queue.length;
  }

  /**
   * Returns total count of mutations in the queue.
   */
  public size(): number {
    return this.queue.length;
  }

  /**
   * Clears the entire queue.
   */
  public clear(): void {
    this.queue = [];
  }
}
