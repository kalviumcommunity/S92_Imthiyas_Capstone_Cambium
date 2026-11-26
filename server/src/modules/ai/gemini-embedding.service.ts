import { Injectable, Logger } from '@nestjs/common';
import { createHash } from 'crypto';

export interface EmbeddingResult {
  embedding: number[];
  dimension: number;
  model: string;
  isMockFallback: boolean;
}

@Injectable()
export class GeminiEmbeddingService {
  private readonly logger = new Logger(GeminiEmbeddingService.name);
  private readonly defaultModel = 'gemini-embedding-001';
  private readonly targetDimension = 768;
  private readonly requestTimeoutMs = 8000;

  private getApiKey(): string | undefined {
    return process.env.GEMINI_API_KEY;
  }

  /**
   * Generates a 768-dimensional normalized embedding for text using Google Gemini gemini-embedding-001.
   * If GEMINI_API_KEY is not configured or in offline test environments, gracefully falls back
   * to a deterministic, L2-normalized 768-dim pseudo-embedding generated from SHA-256.
   */
  async generateEmbedding(text: string): Promise<EmbeddingResult> {
    const apiKey = this.getApiKey();
    const cleanText = text.trim().slice(0, 8000);

    if (!cleanText) {
      return {
        embedding: new Array(this.targetDimension).fill(0),
        dimension: this.targetDimension,
        model: this.defaultModel,
        isMockFallback: true,
      };
    }

    if (apiKey && apiKey !== 'your_google_gemini_api_key_here' && apiKey.length > 10) {
      const controller = new AbortController();
      const timeoutTimer = setTimeout(() => controller.abort(), this.requestTimeoutMs);
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.defaultModel}:embedContent?key=${apiKey}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            model: `models/${this.defaultModel}`,
            content: {
              parts: [{ text: cleanText }],
            },
            outputDimensionality: this.targetDimension,
          }),
        });
        clearTimeout(timeoutTimer);

        if (response.ok) {
          const data = await response.json();
          const values: number[] = data?.embedding?.values || [];
          if (values.length === this.targetDimension) {
            return {
              embedding: values,
              dimension: this.targetDimension,
              model: this.defaultModel,
              isMockFallback: false,
            };
          }
        } else {
          const errorText = await response.text();
          this.logger.warn(`Gemini API returned status ${response.status}: ${errorText}. Using deterministic fallback.`);
        }
      } catch (err: any) {
        clearTimeout(timeoutTimer);
        this.logger.warn(`Gemini API connection/timeout error: ${err.message}. Using deterministic fallback.`);
      }
    }

    // Deterministic mathematical fallback for offline/development mode
    return {
      embedding: this.generateDeterministicVector(cleanText, this.targetDimension),
      dimension: this.targetDimension,
      model: `${this.defaultModel}-deterministic-fallback`,
      isMockFallback: true,
    };
  }

  /**
   * Batch generation bounded cleanly to prevent upstream quota spikes or heap bursts.
   */
  async generateBatchEmbeddings(texts: string[], concurrency = 4): Promise<EmbeddingResult[]> {
    const safeConcurrency = Math.min(Math.max(Number(concurrency) || 4, 1), 6);
    const results: EmbeddingResult[] = [];
    for (let i = 0; i < texts.length; i += safeConcurrency) {
      const chunk = texts.slice(i, i + safeConcurrency);
      const chunkResults = await Promise.all(chunk.map((t) => this.generateEmbedding(t)));
      results.push(...chunkResults);
    }
    return results;
  }

  /**
   * Generates a unit-normalized (L2 norm = 1.0) 768-dimensional float vector
   * derived from the SHA-256 digest of the input string.
   */
  generateDeterministicVector(text: string, dimension: number = 768): number[] {
    const rawVector = new Float64Array(dimension);
    let hash = createHash('sha256').update(text).digest();

    for (let i = 0; i < dimension; i++) {
      if (i % 32 === 0 && i > 0) {
        hash = createHash('sha256').update(hash).digest();
      }
      const byteVal = hash[i % 32];
      // Map byte 0..255 to zero-centered range [-1.0, 1.0]
      rawVector[i] = (byteVal - 127.5) / 127.5;
    }

    // Compute Euclidean L2 Norm: ||v|| = sqrt(sum(v_i^2))
    let sumSq = 0;
    for (let i = 0; i < dimension; i++) {
      sumSq += rawVector[i] * rawVector[i];
    }
    const norm = Math.sqrt(sumSq) || 1;

    // Normalize to unit sphere for accurate cosine similarity
    const normalized: number[] = new Array(dimension);
    for (let i = 0; i < dimension; i++) {
      normalized[i] = parseFloat((rawVector[i] / norm).toFixed(6));
    }

    return normalized;
  }
}
