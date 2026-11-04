import { describe, it, expect, beforeEach } from 'vitest';
import { LlmAutocompleteService } from './llm-autocomplete.service';

describe('LlmAutocompleteService', () => {
  let service: LlmAutocompleteService;

  beforeEach(() => {
    service = new LlmAutocompleteService();
  });

  it('should return empty result for blank or whitespace-only prefix', async () => {
    const res = await service.autocomplete({ prefix: '   ' });
    expect(res.prefix).toBe('');
    expect(res.completion).toBe('');
    expect(res.suggestions).toEqual([]);
  });

  it('should generate relevant scholarly suggestions for search prefix', async () => {
    const res = await service.autocomplete({
      prefix: 'quantum error',
      mode: 'search',
      limit: 3,
    });

    expect(res.prefix).toBe('quantum error');
    expect(res.suggestions.length).toBeGreaterThan(0);
    expect(res.suggestions.length).toBeLessThanOrEqual(3);
    expect(res.completion.length).toBeGreaterThan(0);
    expect(res.model).toBeDefined();
    expect(res.latencyMs).toBeGreaterThanOrEqual(0);

    // Verify first suggestion matches academic domain
    const hasMatch = res.suggestions.some((s) =>
      s.toLowerCase().includes('quantum')
    );
    expect(hasMatch).toBe(true);
  });

  it('should generate academic copilot sentence continuations', async () => {
    const res = await service.autocomplete({
      prefix: 'The primary objective of this investigation',
      mode: 'copilot',
      limit: 2,
    });

    expect(res.suggestions.length).toBeGreaterThan(0);
    expect(res.completion.length).toBeGreaterThan(0);
    expect(res.suggestions[0]).toContain('The primary objective of this investigation');
  });

  it('should dynamically generate plausible completions for unknown novel terms', async () => {
    const res = await service.autocomplete({
      prefix: 'synthetic-nano-bio-computation',
      mode: 'search',
      limit: 4,
    });

    expect(res.suggestions.length).toBe(4);
    expect(res.suggestions[0]).toContain('synthetic-nano-bio-computation');
    expect(res.completion.length).toBeGreaterThan(0);
  });
});
