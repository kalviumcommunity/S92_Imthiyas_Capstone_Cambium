import {
  Controller,
  Post,
  Sse,
  Body,
  HttpCode,
  HttpStatus,
  MessageEvent,
  Inject,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { EventsService } from './events.service';
import { randomUUID } from 'crypto';
import { JwtAuthGuard, AuthenticatedUser } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Realtime Events (SSE)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/v1/events')
export class EventsController {
  constructor(
    @Inject(EventsService)
    private readonly eventsService: EventsService,
  ) {}

  @Sse('stream')
  @ApiOperation({
    summary: 'Subscribe to authenticated HTTP/2 Server-Sent Events stream scoped to current user',
  })
  @ApiResponse({
    status: 200,
    description: 'Server-Sent Events continuous reactive stream',
    content: { 'text/event-stream': {} },
  })
  streamEvents(@CurrentUser() user: AuthenticatedUser): Observable<MessageEvent> {
    return this.eventsService.getStream(user.id);
  }

  @Post('stream/ai-test')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({ summary: 'Dispatch simulated token-by-token AI stream (Non-production only)' })
  @ApiBody({
    schema: {
      properties: {
        prompt: { type: 'string' },
      },
    },
  })
  async triggerAiStream(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: { prompt?: string },
  ) {
    if (process.env.NODE_ENV === 'production') {
      throw new ForbiddenException('Test stream endpoints are disabled in production.');
    }

    const streamId = randomUUID();
    const prompt = body.prompt || 'Quantum Cryptography Proposal Feasibility';

    const tokens = [
      'Evaluating ',
      'research ',
      'proposal: ',
      `"${prompt}". `,
      '\nPrimary finding: Cross-institutional alignment is 94.8%.',
    ];

    setTimeout(() => {
      this.eventsService.streamAiTokens(user.id, streamId, tokens, 40);
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
  @ApiOperation({ summary: 'Dispatch real-time notification test for current user (Non-production only)' })
  async triggerTestNotification(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: { title?: string; message?: string },
  ) {
    if (process.env.NODE_ENV === 'production') {
      throw new ForbiddenException('Test notification endpoints are disabled in production.');
    }

    const title = body.title || 'New Grant Match';
    const message = body.message || 'Genomics Core Facility grant matches your profile.';

    this.eventsService.dispatchNotification(user.id, {
      id: randomUUID(),
      title,
      message,
      createdAt: new Date().toISOString(),
    });

    return { success: true, message: 'Notification dispatched to SSE channel' };
  }
}
