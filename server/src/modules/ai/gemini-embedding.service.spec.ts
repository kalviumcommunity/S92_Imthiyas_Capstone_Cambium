import { describe, it, expect, beforeEach } from 'vitest';
import { GeminiEmbeddingService } from './gemini-embedding.service';

describe('GeminiEmbeddingService', () => {
  let service: GeminiEmbeddingService;

  beforeEach(() => {
    service = new GeminiEmbeddingService();
  });

  it('should generate a 768-dimensional normalized vector using deterministic fallback', async () => {
    const text = 'Quantum Key Distribution for Critical Infrastructure';
    const result = await service.generateEmbedding(text);

    expect(result.dimension).toBe(768);
    expect(result.embedding.length).toBe(768);

    // Verify L2 norm is approximately 1.0 (unit sphere)
    const normSq = result.embedding.reduce((sum, val) => sum + val * val, 0);
    const norm = Math.sqrt(normSq);
    expect(norm).toBeCloseTo(1.0, 1);
  });

  it('should generate identical vectors for identical inputs (deterministic property)', async () => {
    const text = 'CRISPR Cas13 programmable RNA editing';
    const res1 = await service.generateEmbedding(text);
    const res2 = await service.generateEmbedding(text);

    expect(res1.embedding).toEqual(res2.embedding);
  });

  it('should generate batch embeddings correctly', async () => {
    const texts = ['Topic A', 'Topic B', 'Topic C'];
    const results = await service.generateBatchEmbeddings(texts, 2);

    expect(results.length).toBe(3);
    expect(results[0].embedding.length).toBe(768);
  });
});
