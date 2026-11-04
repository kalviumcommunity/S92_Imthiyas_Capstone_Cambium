import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { LlmAutocompleteService, AutocompleteResult } from './llm-autocomplete.service';
import { AutocompleteDto } from './dto/autocomplete.dto';

@ApiTags('AI Intelligence & Autocomplete')
@Controller('api/v1/ai')
export class AiAutocompleteController {
  constructor(private readonly autocompleteService: LlmAutocompleteService) {}

  @Post('autocomplete')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @ApiOperation({
    summary: 'Generate real-time LLM/AI-assisted autocompletions for scholarly search and proposal drafting',
    description:
      'Dispatches prompt to Google Gemini 1.5 Flash (or deterministic scholarly fallback) to provide inline ghost-text and alternative suggestion rankings.',
  })
  @ApiBody({ type: AutocompleteDto })
  @ApiResponse({
    status: 200,
    description: 'Successful autocomplete generation with latency metrics and provider provenance.',
    schema: {
      type: 'object',
      properties: {
        prefix: { type: 'string', example: 'quantum error' },
        completion: {
          type: 'string',
          example: ' correction in fault-tolerant surface codes',
        },
        suggestions: {
          type: 'array',
          items: { type: 'string' },
          example: [
            'quantum error correction in fault-tolerant surface codes',
            'quantum supremacy benchmarks on superconducting NISQ processors',
          ],
        },
        source: { type: 'string', example: 'gemini-1.5-flash' },
        latencyMs: { type: 'number', example: 42 },
        model: { type: 'string', example: 'gemini-1.5-flash' },
      },
    },
  })
  async getAutocomplete(@Body() dto: AutocompleteDto): Promise<AutocompleteResult> {
    return this.autocompleteService.autocomplete(dto);
  }
}
