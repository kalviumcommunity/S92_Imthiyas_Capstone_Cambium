import { Module } from '@nestjs/common';
import { GeminiEmbeddingService } from './gemini-embedding.service';
import { LlmAutocompleteService } from './llm-autocomplete.service';
import { AiAutocompleteController } from './ai-autocomplete.controller';

@Module({
  controllers: [AiAutocompleteController],
  providers: [GeminiEmbeddingService, LlmAutocompleteService],
  exports: [GeminiEmbeddingService, LlmAutocompleteService],
})
export class AiModule {}
