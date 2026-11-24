import { describe, it, expect, beforeEach } from 'vitest';
import { firstValueFrom, take, toArray } from 'rxjs';
import { EventsService } from './events.service';

describe('EventsService (SSE Isolation & Security)', () => {
  let service: EventsService;

  beforeEach(() => {
    service = new EventsService();
  });

  it('should never leak user-targeted events to anonymous/unspecified streams', async () => {
    const received: any[] = [];
    const sub = service.getStream(undefined).subscribe((ev) => received.push(ev));

    service.dispatchNotification('user-secret-1', { message: 'Confidential grant alert' });
    service.emit({ type: 'grant_alert', data: { title: 'Public NSF announcement' } });

    await new Promise((r) => setTimeout(r, 20));
    sub.unsubscribe();

    const messages = received.map((r) => JSON.stringify(r));
    expect(messages.some((m) => m.includes('Confidential grant alert'))).toBe(false);
    expect(messages.some((m) => m.includes('Public NSF announcement'))).toBe(true);
  });

  it('should deliver user-targeted events strictly to the matching authenticated user', async () => {
    const aliceEvents: any[] = [];
    const bobEvents: any[] = [];

    const subA = service.getStream('alice').subscribe((ev) => aliceEvents.push(ev));
    const subB = service.getStream('bob').subscribe((ev) => bobEvents.push(ev));

    service.dispatchNotification('alice', { title: 'Alice Private Invite' });

    await new Promise((r) => setTimeout(r, 20));
    subA.unsubscribe();
    subB.unsubscribe();

    expect(aliceEvents.some((e) => JSON.stringify(e).includes('Alice Private Invite'))).toBe(true);
    expect(bobEvents.some((e) => JSON.stringify(e).includes('Alice Private Invite'))).toBe(false);
  });
});
