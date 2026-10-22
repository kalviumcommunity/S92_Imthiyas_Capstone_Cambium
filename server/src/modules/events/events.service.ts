import { Injectable, Logger, MessageEvent } from '@nestjs/common';
import { Subject, Observable, merge, interval, from } from 'rxjs';
import { map, filter, concatMap, delay } from 'rxjs/operators';
import { randomUUID } from 'crypto';

export interface CambiumStreamPayload {
  type: 'handshake' | 'heartbeat' | 'notification' | 'badge_count' | 'ai_token' | 'grant_alert';
  userId?: string;
  data: any;
  id?: string;
  timestamp?: string;
}

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);
  private readonly eventSubject = new Subject<CambiumStreamPayload>();

  /**
   * Broadcast an event to all connected scholars or a targeted user
   */
  emit(payload: CambiumStreamPayload) {
    const enriched: CambiumStreamPayload = {
      ...payload,
      id: payload.id || randomUUID(),
      timestamp: payload.timestamp || new Date().toISOString(),
    };
    this.eventSubject.next(enriched);
  }

  /**
   * Push a notification event to a specific scholar
   */
  dispatchNotification(userId: string, notification: any) {
    this.emit({
      type: 'notification',
      userId,
      data: notification,
    });
  }

  /**
   * Update real-time unread badge indicator count for a user
   */
  dispatchBadgeCount(userId: string, unreadCount: number) {
    this.emit({
      type: 'badge_count',
      userId,
      data: { unreadCount },
    });
  }

  /**
   * Stream token-by-token AI reasoning/critique for proposal refinement
   */
  async streamAiTokens(userId: string, streamId: string, tokens: string[], intervalMs = 60) {
    for (let i = 0; i < tokens.length; i++) {
      const isLast = i === tokens.length - 1;
      this.emit({
        type: 'ai_token',
        userId,
        data: {
          streamId,
          token: tokens[i],
          index: i,
          isDone: isLast,
        },
      });
      if (intervalMs > 0 && !isLast) {
        await new Promise((resolve) => setTimeout(resolve, intervalMs));
      }
    }
  }

  /**
   * Generates the multi-channel Server-Sent Events stream for a connected scholar
   */
  getStream(userId?: string): Observable<MessageEvent> {
    // 1. Initial handshake event upon connection
    const handshake$: Observable<CambiumStreamPayload> = from([
      {
        type: 'handshake' as const,
        userId,
        id: randomUUID(),
        timestamp: new Date().toISOString(),
        data: {
          status: 'CONNECTED',
          protocol: 'HTTP/2-SSE',
          subscribedUser: userId || 'anonymous',
          supportedChannels: ['notifications', 'badges', 'ai_tokens', 'heartbeat'],
        },
      },
    ]);

    // 2. Periodic 20s heartbeat to maintain open socket and bypass proxy timeouts
    const heartbeat$: Observable<CambiumStreamPayload> = interval(20000).pipe(
      map(() => ({
        type: 'heartbeat' as const,
        id: randomUUID(),
        timestamp: new Date().toISOString(),
        data: { status: 'alive' },
      })),
    );

    // 3. User-filtered or global event dispatching
    const userEvents$ = this.eventSubject.asObservable().pipe(
      filter((event) => {
        if (!event.userId) return true; // Global event
        return !userId || event.userId === userId;
      }),
    );

    // Merge and format into W3C standard MessageEvent
    return merge(handshake$, heartbeat$, userEvents$).pipe(
      map((payload: CambiumStreamPayload): MessageEvent => {
        return {
          data: payload.data,
          type: payload.type,
          id: payload.id,
          retry: 5000,
        };
      }),
    );
  }
}
