import {
  Controller,
  Get,
  Post,
  Sse,
  Query,
  Body,
  HttpCode,
  HttpStatus,
  MessageEvent,
  Inject,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBody } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { EventsService } from './events.service';
import { randomUUID } from 'crypto';

@ApiTags('Realtime Events (SSE)')
@Controller('api/v1/events')
export class EventsController {
  constructor(
    @Inject(EventsService)
    private readonly eventsService: EventsService,
  ) {}

  @Sse('stream')
  @ApiOperation({
    summary: 'Subscribe to HTTP/2 Server-Sent Events stream for notifications, badge counts, and AI token streams',
  })
  @ApiQuery({ name: 'userId', required: false, description: 'Optional user UUID to scope private channels' })
  @ApiResponse({
    status: 200,
    description: 'Server-Sent Events continuous reactive stream',
    content: { 'text/event-stream': {} },
  })
  streamEvents(@Query('userId') userId?: string): Observable<MessageEvent> {
    return this.eventsService.getStream(userId);
  }

  @Post('stream/ai-test')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({ summary: 'Dispatch simulated token-by-token AI stream (Testing & Demo)' })
  @ApiBody({
    schema: {
      properties: {
        userId: { type: 'string' },
        prompt: { type: 'string' },
      },
    },
  })
  async triggerAiStream(@Body() body: { userId?: string; prompt?: string }) {
    const userId = body.userId || 'demo-researcher';
    const streamId = randomUUID();
    const prompt = body.prompt || 'Quantum Cryptography Proposal Feasibility';

    const tokens = [
      'Evaluating ',
      'research ',
      'proposal: ',
      `"${prompt}". `,
      '\n',
      'Primary ',
      'finding: ',
      'Cross-institutional ',
      'alignment ',
      'with ',
      'Horizon ',
      'Europe ',
      'Cluster ',
      '4 ',
      'is ',
      '94.8%.\n',
      'Key ',
      'methodology ',
      'strength: ',
      'Post-quantum ',
      'lattice-based ',
      'key ',
      'distribution.\n',
      'Recommendation: ',
      'Submit ',
      'before ',
      'November ',
      'call ',
      'closure.',
    ];

    // Trigger async stream without blocking HTTP response
    setTimeout(() => {
      this.eventsService.streamAiTokens(userId, streamId, tokens, 40);
    }, 100);

    return {
      success: true,
      streamId,
      message: 'AI stream initiated over SSE channel',
      totalTokens: tokens.length,
    };
  }

  @Post('stream/notify-test')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Dispatch real-time notification & unread badge test' })
  async triggerTestNotification(
    @Body() body: { userId?: string; title?: string; message?: string },
  ) {
    const userId = body.userId || 'demo-researcher';
    const title = body.title || 'New NIH Grant Match';
    const message = body.message || 'Genomics Core Facility grant ($1.2M) matches your profile.';

    this.eventsService.dispatchNotification(userId, {
      id: randomUUID(),
      title,
      message,
      createdAt: new Date().toISOString(),
    });

    this.eventsService.dispatchBadgeCount(userId, Math.floor(Math.random() * 5) + 1);

    return { success: true, message: 'Notification dispatched to SSE channel' };
  }
}
