import { Injectable, BadRequestException } from '@nestjs/common';

export type AiTaskType =
  | 'chat_synthesis'
  | 'research_classification'
  | 'autocomplete'
  | 'embedding'
  | 'structured_extraction'
  | 'rerank';

export interface AiModelSpec {
  task: AiTaskType;
  provider: 'google-gemini';
  modelId: string;
  fallbackModelId?: string;
  version: string;
  contextWindowTokens: number;
  maxInputTokens: number;
  maxOutputTokens: number;
  temperature: number;
  timeoutMs: number;
  maxRetries: number;
  costPer1kInputUsd: number;
  costPer1kOutputUsd: number;
  embeddingDimensions?: number;
}

export const AI_MODEL_REGISTRY: Record<AiTaskType, AiModelSpec> = {
  chat_synthesis: {
    task: 'chat_synthesis',
    provider: 'google-gemini',
    modelId: 'gemini-2.0-flash',
    fallbackModelId: 'gemini-1.5-flash',
    version: '2026-04-chat-v1',
    contextWindowTokens: 1_000_000,
    maxInputTokens: 12_000,
    maxOutputTokens: 1_536,
    temperature: 0.15,
    timeoutMs: 12_000,
    maxRetries: 1,
    costPer1kInputUsd: 0.0001,
    costPer1kOutputUsd: 0.0004,
  },
  structured_extraction: {
    task: 'structured_extraction',
    provider: 'google-gemini',
    modelId: 'gemini-2.0-flash',
    fallbackModelId: 'gemini-1.5-flash',
    version: '2026-04-extract-v1',
    contextWindowTokens: 1_000_000,
    maxInputTokens: 10_000,
    maxOutputTokens: 1_024,
    temperature: 0.0,
    timeoutMs: 10_000,
    maxRetries: 1,
    costPer1kInputUsd: 0.0001,
    costPer1kOutputUsd: 0.0004,
  },
  research_classification: {
    task: 'research_classification',
    provider: 'google-gemini',
    modelId: 'gemini-1.5-flash',
    version: '2026-04-classify-v1',
    contextWindowTokens: 1_000_000,
    maxInputTokens: 4_000,
    maxOutputTokens: 256,
    temperature: 0.0,
    timeoutMs: 5_000,
    maxRetries: 1,
    costPer1kInputUsd: 0.000075,
    costPer1kOutputUsd: 0.0003,
  },
  autocomplete: {
    task: 'autocomplete',
    provider: 'google-gemini',
    modelId: 'gemini-1.5-flash',
    version: '2026-04-autocomplete-v1',
    contextWindowTokens: 1_000_000,
    maxInputTokens: 1_500,
    maxOutputTokens: 256,
    temperature: 0.2,
    timeoutMs: 2_000,
    maxRetries: 0,
    costPer1kInputUsd: 0.000075,
    costPer1kOutputUsd: 0.0003,
  },
  embedding: {
    task: 'embedding',
    provider: 'google-gemini',
    modelId: 'gemini-embedding-001',
    version: 'v1-768d',
    contextWindowTokens: 2_048,
    maxInputTokens: 2_048,
    maxOutputTokens: 0,
    temperature: 0,
    timeoutMs: 6_000,
    maxRetries: 1,
    costPer1kInputUsd: 0.00002,
    costPer1kOutputUsd: 0,
    embeddingDimensions: 768,
  },
  rerank: {
    task: 'rerank',
    provider: 'google-gemini',
    modelId: 'gemini-1.5-flash',
    version: '2026-04-rerank-v1',
    contextWindowTokens: 1_000_000,
    maxInputTokens: 6_000,
    maxOutputTokens: 512,
    temperature: 0.0,
    timeoutMs: 5_000,
    maxRetries: 0,
    costPer1kInputUsd: 0.000075,
    costPer1kOutputUsd: 0.0003,
  },
};

@Injectable()
export class AiModelRegistry {
  getSpec(task: AiTaskType): AiModelSpec {
    return AI_MODEL_REGISTRY[task];
  }

  listSpecs(): AiModelSpec[] {
    return Object.values(AI_MODEL_REGISTRY);
  }

  estimateTokens(text: string): number {
    if (!text) return 0;
    return Math.ceil(text.length / 4);
  }

  estimateCostUsd(task: AiTaskType, inputTokens: number, outputTokens: number): number {
    const spec = this.getSpec(task);
    const inCost = (inputTokens / 1000) * spec.costPer1kInputUsd;
    const outCost = (outputTokens / 1000) * spec.costPer1kOutputUsd;
    return Number((inCost + outCost).toFixed(6));
  }

  enforceInputBudget(task: AiTaskType, promptText: string): {
    tokens: number;
    truncatedText: string;
    wasTruncated: boolean;
  } {
    const spec = this.getSpec(task);
    const maxChars = spec.maxInputTokens * 4;
    if (promptText.length > maxChars) {
      return {
        tokens: spec.maxInputTokens,
        truncatedText: promptText.slice(0, maxChars),
        wasTruncated: true,
      };
    }
    return {
      tokens: this.estimateTokens(promptText),
      truncatedText: promptText,
      wasTruncated: false,
    };
  }

  assertStrictBudget(task: AiTaskType, text: string): number {
    const spec = this.getSpec(task);
    const estimated = this.estimateTokens(text);
    if (estimated > spec.maxInputTokens) {
      throw new BadRequestException(
        `Input exceeds token budget for ${task} (${estimated} > ${spec.maxInputTokens} max input tokens).`,
      );
    }
    return estimated;
  }
}
