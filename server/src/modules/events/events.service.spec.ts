import { describe, it, expect, beforeEach } from 'vitest';
import { EventsService } from './events.service';
import { take } from 'rxjs/operators';

describe('EventsService', () => {
  let eventsService: EventsService;

  beforeEach(() => {
    eventsService = new EventsService();
  });

  it('should emit initial handshake event on stream subscription', async () => {
    const stream$ = eventsService.getStream('scholar-alice');

    return new Promise<void>((resolve) => {
      stream$.pipe(take(1)).subscribe((event) => {
        const data = event.data as any;
        expect(event.type).toBe('handshake');
        expect(data).toBeDefined();
        expect(data.status).toBe('CONNECTED');
        expect(data.subscribedUser).toBe('scholar-alice');
        resolve();
      });
    });
  });

  it('should dispatch targeted notification event to subscribed scholar', async () => {
    const stream$ = eventsService.getStream('scholar-bob');

    return new Promise<void>((resolve) => {
      // Subscribe and skip handshake
      let eventCount = 0;
      stream$.subscribe((event) => {
        eventCount++;
        if (eventCount === 2) {
          const data = event.data as any;
          expect(event.type).toBe('notification');
          expect(data.title).toBe('Quantum Grant Call');
          resolve();
        }
      });

      // Dispatch event
      eventsService.dispatchNotification('scholar-bob', {
        title: 'Quantum Grant Call',
        message: 'Application open now',
      });
    });
  });

  it('should dispatch unread badge count updates', async () => {
    const stream$ = eventsService.getStream('scholar-charlie');

    return new Promise<void>((resolve) => {
      let count = 0;
      stream$.subscribe((event) => {
        count++;
        if (count === 2) {
          const data = event.data as any;
          expect(event.type).toBe('badge_count');
          expect(data.unreadCount).toBe(7);
          resolve();
        }
      });

      eventsService.dispatchBadgeCount('scholar-charlie', 7);
    });
  });
});
