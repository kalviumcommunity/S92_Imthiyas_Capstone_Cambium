import { Injectable, Logger, Optional } from '@nestjs/common';
import { AiModelRegistry, AiTaskType } from './ai-model-registry';

export interface ProviderGenerateRequest {
  task: AiTaskType;
  prompt: string;
  responseMimeType?: 'text/plain' | 'application/json';
  temperatureOverride?: number;
  maxOutputTokensOverride?: number;
}

export interface ProviderGenerateResult {
  ok: boolean;
  text: string | null;
  modelUsed: string;
  modelVersion: string;
  latencyMs: number;
  estimatedInputTokens: number;
  estimatedOutputTokens: number;
  estimatedCostUsd: number;
  errorCode?: 'API_KEY_UNCONFIGURED' | 'PROVIDER_TIMEOUT' | 'PROVIDER_RATE_LIMIT' | 'PROVIDER_ERROR';
}

const RETRIABLE_HTTP = new Set([429, 502, 503, 504]);

@Injectable()
export class GeminiProviderService {
  private readonly logger = new Logger(GeminiProviderService.name);
  private readonly registry: AiModelRegistry;

  constructor(@Optional() registry?: AiModelRegistry) {
    this.registry = registry || new AiModelRegistry();
  }

  private getApiKey(): string | undefined {
    const key = process.env.GEMINI_API_KEY?.trim();
    if (!key || key === 'your_google_gemini_api_key_here' || key.length <= 10) {
      return undefined;
    }
    return key;
  }

  isConfigured(): boolean {
    return Boolean(this.getApiKey());
  }

  async generateText(req: ProviderGenerateRequest): Promise<ProviderGenerateResult> {
    const startMs = Date.now();
    const spec = this.registry.getSpec(req.task);
    const { tokens: inTokens, truncatedText } = this.registry.enforceInputBudget(
      req.task,
      req.prompt,
    );

    const apiKey = this.getApiKey();
    if (!apiKey) {
      return {
        ok: false,
        text: null,
        modelUsed: `${spec.modelId}-offline`,
        modelVersion: spec.version,
        latencyMs: Date.now() - startMs,
        estimatedInputTokens: inTokens,
        estimatedOutputTokens: 0,
        estimatedCostUsd: 0,
        errorCode: 'API_KEY_UNCONFIGURED',
      };
    }

    const candidates = [spec.modelId, ...(spec.fallbackModelId ? [spec.fallbackModelId] : [])];
    let lastErrorCode: ProviderGenerateResult['errorCode'] = 'PROVIDER_ERROR';

    for (const modelId of candidates) {
      for (let attempt = 0; attempt <= spec.maxRetries; attempt++) {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), spec.timeoutMs);

        try {
          const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${apiKey}`;
          const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            signal: controller.signal,
            body: JSON.stringify({
              contents: [{ role: 'user', parts: [{ text: truncatedText }] }],
              generationConfig: {
                temperature: req.temperatureOverride ?? spec.temperature,
                maxOutputTokens: req.maxOutputTokensOverride ?? spec.maxOutputTokens,
                ...(req.responseMimeType ? { responseMimeType: req.responseMimeType } : {}),
              },
            }),
          });
          clearTimeout(timer);

          if (res.ok) {
            const payload = await res.json();
            const generated = payload?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (typeof generated === 'string' && generated.trim().length > 0) {
              const outTokens = this.registry.estimateTokens(generated);
              return {
                ok: true,
                text: generated,
                modelUsed: modelId,
                modelVersion: spec.version,
                latencyMs: Date.now() - startMs,
                estimatedInputTokens: inTokens,
                estimatedOutputTokens: outTokens,
                estimatedCostUsd: this.registry.estimateCostUsd(req.task, inTokens, outTokens),
              };
            }
          }

          if (res.status === 429) {
            lastErrorCode = 'PROVIDER_RATE_LIMIT';
          }
          if (!RETRIABLE_HTTP.has(res.status)) {
            break;
          }
        } catch (err: any) {
          clearTimeout(timer);
          if (err?.name === 'AbortError') {
            lastErrorCode = 'PROVIDER_TIMEOUT';
          } else {
            lastErrorCode = 'PROVIDER_ERROR';
          }
          // Redact any accidental URL query key before logging
          this.logger.warn(
            `Gemini generation attempt failed [task=${req.task}, model=${modelId}, code=${lastErrorCode}]`,
          );
        }

        if (attempt < spec.maxRetries) {
          await new Promise((r) => setTimeout(r, 150 * Math.pow(2, attempt)));
        }
      }
    }

    return {
      ok: false,
      text: null,
      modelUsed: spec.modelId,
      modelVersion: spec.version,
      latencyMs: Date.now() - startMs,
      estimatedInputTokens: inTokens,
      estimatedOutputTokens: 0,
      estimatedCostUsd: 0,
      errorCode: lastErrorCode,
    };
  }
}
