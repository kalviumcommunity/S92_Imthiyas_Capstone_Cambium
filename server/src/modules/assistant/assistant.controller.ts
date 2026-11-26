import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  Req,
  HttpCode,
  HttpStatus,
  Inject,
  UseGuards,
  Sse,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { AssistantService } from './assistant.service';
import { AssistantChatDto } from './dto/assistant-chat.dto';
import { JwtAuthGuard, AuthenticatedUser } from '../auth/guards/jwt-auth.guard';
import { SubscriptionGuard, RequiresSubscription } from '../auth/guards/subscription.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

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
    summary: 'Evidence-grounded RAG chat with citation verification, abstention, and bounded tools',
  })
  @ApiResponse({ status: 200, description: 'Grounded scholar reply with verified citations and tool trace' })
  async chat(
    @Body() body: AssistantChatDto,
    @CurrentUser() caller: AuthenticatedUser,
    @Req() req: any,
  ) {
    return this.assistantService.chat(body, caller, req?.requestId);
  }

  @Post('stream')
  @Sse()
  @RequiresSubscription('pro')
  @ApiOperation({ summary: 'Stream grounded AI responses token-by-token via Server-Sent Events (SSE)' })
  streamChat(
    @Body() body: AssistantChatDto,
    @CurrentUser() caller: AuthenticatedUser,
    @Req() req: any,
  ): Observable<MessageEvent> {
    return new Observable<MessageEvent>((subscriber) => {
      (async () => {
        try {
          for await (const chunk of this.assistantService.streamChat(body, caller, req?.requestId)) {
            subscriber.next({ data: chunk.data });
          }
          subscriber.complete();
        } catch (err: any) {
          subscriber.error(err);
        }
      })();
    });
  }

  @Get('conversations')
  @RequiresSubscription('pro')
  @ApiOperation({ summary: 'List caller AI research conversation sessions' })
  async listConversations(@CurrentUser() caller: AuthenticatedUser) {
    return this.assistantService.listConversations(caller.id);
  }

  @Get('conversations/:id')
  @RequiresSubscription('pro')
  @ApiOperation({ summary: 'Fetch an owned AI conversation session and message history' })
  async getConversation(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() caller: AuthenticatedUser,
  ) {
    return this.assistantService.getConversation(id, caller.id);
  }

  @Delete('conversations/:id')
  @RequiresSubscription('pro')
  @ApiOperation({ summary: 'Delete an owned AI conversation session' })
  async deleteConversation(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() caller: AuthenticatedUser,
  ) {
    return this.assistantService.deleteConversation(id, caller.id);
  }
}
