import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GeminiEmbeddingService } from './gemini-embedding.service';
import { LlmAutocompleteService } from './llm-autocomplete.service';
import { AiAutocompleteController } from './ai-autocomplete.controller';
import { AiModelRegistry } from './ai-model-registry';
import { AiPromptRegistry } from './ai-prompt-registry';
import { GeminiProviderService } from './gemini-provider.service';
import { DocumentRetrievalService } from './document-retrieval.service';
import { DocumentParserService } from '../reader/document-parser.service';
import { DocumentChunk } from './entities/document-chunk.entity';
import { AiConversation } from './entities/ai-conversation.entity';
import { AiMessage } from './entities/ai-message.entity';
import { AiRequestTelemetry } from './entities/ai-request-telemetry.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DocumentChunk,
      AiConversation,
      AiMessage,
      AiRequestTelemetry,
    ]),
  ],
  controllers: [AiAutocompleteController],
  providers: [
    AiModelRegistry,
    AiPromptRegistry,
    GeminiProviderService,
    GeminiEmbeddingService,
    LlmAutocompleteService,
    DocumentRetrievalService,
    DocumentParserService,
  ],
  exports: [
    AiModelRegistry,
    AiPromptRegistry,
    GeminiProviderService,
    GeminiEmbeddingService,
    LlmAutocompleteService,
    DocumentRetrievalService,
    DocumentParserService,
    TypeOrmModule,
  ],
})
export class AiModule {}
