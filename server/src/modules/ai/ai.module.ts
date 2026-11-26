import { Module } from '@nestjs/common';
import { GeminiEmbeddingService } from './gemini-embedding.service';
import { LlmAutocompleteService } from './llm-autocomplete.service';
import { AiAutocompleteController } from './ai-autocomplete.controller';
import { AiModelRegistry } from './ai-model-registry';
import { AiPromptRegistry } from './ai-prompt-registry';
import { GeminiProviderService } from './gemini-provider.service';

@Module({
  controllers: [AiAutocompleteController],
  providers: [
    AiModelRegistry,
    AiPromptRegistry,
    GeminiProviderService,
    GeminiEmbeddingService,
    LlmAutocompleteService,
  ],
  exports: [
    AiModelRegistry,
    AiPromptRegistry,
    GeminiProviderService,
    GeminiEmbeddingService,
    LlmAutocompleteService,
  ],
})
export class AiModule {}
