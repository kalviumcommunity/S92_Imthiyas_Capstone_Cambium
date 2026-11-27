import { Controller, Post, Body, HttpCode, HttpStatus, Inject, UseGuards, Sse } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { AssistantService, AssistantChatRequest } from './assistant.service';
import { JwtAuthGuard, AuthenticatedUser } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { SubscriptionGuard, RequiresSubscription } from '../auth/guards/subscription.guard';

interface MessageEvent {
  data: string | object;
  id?: string;
  type?: string;
  retry?: number;
}

@ApiTags('AI Research Assistant (Agentic RAG)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, SubscriptionGuard)
@Controller(['api/v1/assistant', 'api/assistant'])
export class AssistantController {
  constructor(
    @Inject(AssistantService)
    private readonly assistantService: AssistantService,
  ) {}

  @Post('chat')
  @HttpCode(HttpStatus.OK)
  @RequiresSubscription('pro')
  @ApiOperation({
    summary: 'Multi-turn Agentic RAG chat with tool calling (eligibility verification, grant matching, proposal extraction)',
  })
  @ApiBody({
    schema: {
      properties: {
        messages: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              role: { type: 'string', enum: ['user', 'assistant', 'system'] },
              content: { type: 'string' },
            },
          },
        },
        context: {
          type: 'object',
          properties: {
            userProfile: { type: 'object' },
            opportunityId: { type: 'string' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Scholar assistant reply with executed tools and grounded citations' })
  async chat(
    @Body() body: AssistantChatRequest,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.assistantService.chat(body, user);
  }

  @Post('stream')
  @Sse()
  @RequiresSubscription('pro')
  @ApiOperation({ summary: 'Stream Agentic RAG responses token-by-token via Server-Sent Events (SSE)' })
  streamChat(
    @Body() body: AssistantChatRequest,
    @CurrentUser() user: AuthenticatedUser,
  ): Observable<MessageEvent> {
    return new Observable<MessageEvent>((subscriber) => {
      (async () => {
        try {
          for await (const chunk of this.assistantService.streamChat(body, user)) {
            subscriber.next({ data: chunk.data });
          }
          subscriber.complete();
        } catch (err: any) {
          subscriber.error(err);
        }
      })();
    });
  }
}
