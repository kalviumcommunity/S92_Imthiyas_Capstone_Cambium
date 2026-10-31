import {
  queryRagEngine,
  ScholarPersona,
  RagResponse,
} from '../../client/lib/ai/rag-engine';

describe('Suite 08: Client-Side Scholarly RAG Engine & Semantic Retrieval', () => {
  it('should retrieve relevant scholarly chunks and return grounded citations for grant queries', async () => {
    const res: RagResponse = await queryRagEngine({
      query: 'Horizon Europe quantum materials funding requirements and open access',
      persona: 'General Assistant',
      topK: 2,
    });

    expect(res).toBeDefined();
    expect(res.answer).toContain('Horizon Europe');
    expect(res.citations.length).toBeGreaterThan(0);
    expect(res.citations[0].title).toContain('Horizon Europe');
    expect(res.citations[0].section).toBeDefined();
    expect(res.citations[0].similarity).toBeGreaterThan(0.2);
  });

  it('should switch into Methodology Auditor persona with formal experimental checklists', async () => {
    const res: RagResponse = await queryRagEngine({
      query: 'Neuro-symbolic chemical inference treewidth bounds',
      persona: 'Methodology Auditor',
    });

    expect(res.persona).toBe('Methodology Auditor');
    expect(res.answer).toContain('Methodology Auditor');
    expect(res.answer).toContain('Internal Validity');
    expect(res.citations.some((c) => c.title.includes('Neuro-Symbolic'))).toBe(true);
  });

  it('should switch into Statistical Rigor persona with mathematical complexity bounds', async () => {
    const res: RagResponse = await queryRagEngine({
      query: 'Transformer attention scaled dot product formula',
      persona: 'Statistical Rigor',
    });

    expect(res.persona).toBe('Statistical Rigor');
    expect(res.answer).toContain('Statistical Rigor');
    expect(res.answer).toContain('Asymptotic Complexity');
    expect(res.citations.some((c) => c.title.includes('Attention Is All You Need'))).toBe(true);
  });

  it('should switch into Reproducibility Engine persona with compute infrastructure parameters', async () => {
    const res: RagResponse = await queryRagEngine({
      query: 'FAIR data management Zenodo and Dryad repositories',
      persona: 'Reproducibility Engine',
    });

    expect(res.persona).toBe('Reproducibility Engine');
    expect(res.answer).toContain('Reproducibility Engine');
    expect(res.answer).toContain('Computational Reproducibility Parameters');
    expect(res.citations.some((c) => c.title.includes('FAIR Data Management'))).toBe(true);
  });

  it('should provide fallback suggestions when query matches no known semantic concepts', async () => {
    const res: RagResponse = await queryRagEngine({
      query: 'xyzzy-random-unmatched-gibberish-string-12345',
    });

    expect(res.answer).toContain('Suggested Actions');
  });
});
