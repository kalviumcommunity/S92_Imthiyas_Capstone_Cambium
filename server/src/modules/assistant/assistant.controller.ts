import { Controller, Post, Body, HttpCode, HttpStatus, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AssistantService, AssistantChatRequest } from './assistant.service';

@ApiTags('AI Research Assistant (Agentic RAG)')
@Controller('api/v1/assistant')
export class AssistantController {
  constructor(
    @Inject(AssistantService)
    private readonly assistantService: AssistantService,
  ) {}

  @Post('chat')
  @HttpCode(HttpStatus.OK)
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
  async chat(@Body() body: AssistantChatRequest) {
    return this.assistantService.chat(body);
  }
}
