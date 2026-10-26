import {
  generateBibtex,
  generateApa7,
  generateIeee,
  generateCitation,
  escapeLatex,
  CitationMetadata,
} from '../../client/lib/citation';

describe('Suite 01: Academic Citation Generator Engine (BibTeX, APA, IEEE)', () => {
  const sampleArticle: CitationMetadata = {
    title: 'Living Materials & Biosensing Microfluidics for Quantum Genomics',
    authors: ['Shaik Mohamed Imthiyas', 'Elena Rostova', 'Marcus Vance'],
    year: 2026,
    venue: 'Journal of Computational Biophysics',
    doi: '10.1038/s41586-026-00123-x',
    url: 'https://doi.org/10.1038/s41586-026-00123-x',
    volume: '42',
    issue: '3',
    pages: '115-128',
    entryType: 'article',
  };

  describe('BibTeX Generation', () => {
    it('should generate a valid BibTeX article entry with complete metadata', () => {
      const bib = generateBibtex(sampleArticle);

      expect(bib).toContain('@article{Imthiyas2026Living,');
      expect(bib).toContain('author = {Shaik Mohamed Imthiyas and Elena Rostova and Marcus Vance}');
      expect(bib).toContain('title = {Living Materials & Biosensing Microfluidics for Quantum Genomics}');
      expect(bib).toContain('journal = {Journal of Computational Biophysics}');
      expect(bib).toContain('year = {2026}');
      expect(bib).toContain('volume = {42}');
      expect(bib).toContain('number = {3}');
      expect(bib).toContain('pages = {115-128}');
      expect(bib).toContain('doi = {10.1038/s41586-026-00123-x}');
    });

    it('should fallback to Anonymous citation key when authors array is empty', () => {
      const anonymousArticle: CitationMetadata = {
        title: 'Quantum State Tomography Report',
        year: 2025,
      };

      const bib = generateBibtex(anonymousArticle);
      expect(bib).toContain('@misc{Anonymous2025Quantum,');
      expect(bib).toContain('author = {Anonymous}');
      expect(bib).toContain('howpublished = {Cambium Research Platform}');
    });

    it('should properly escape LaTeX special characters (&, %, $, #, _)', () => {
      const rawText = 'DNA & RNA in 95% Ethanol with $100 #1 Cost_Analysis';
      const escaped = escapeLatex(rawText);

      expect(escaped).toBe('DNA \\& RNA in 95\\% Ethanol with \\$100 \\#1 Cost\\_Analysis');
    });
  });

  describe('APA 7th Edition Generation', () => {
    it('should format APA 7th style for 3 authors with ampersand and italics journal', () => {
      const apa = generateApa7(sampleArticle);

      expect(apa).toContain('Imthiyas, S. M., Rostova, E., & Vance, M.');
      expect(apa).toContain('(2026).');
      expect(apa).toContain('Living Materials & Biosensing Microfluidics for Quantum Genomics.');
      expect(apa).toContain('*Journal of Computational Biophysics*');
      expect(apa).toContain('*42*(3), 115-128.');
      expect(apa).toContain('https://doi.org/10.1038/s41586-026-00123-x');
    });

    it('should format single author APA style correctly', () => {
      const singleAuthor: CitationMetadata = {
        title: 'Deep Multi-Agent Coordination',
        authors: ['Ada Lovelace'],
        year: 1843,
      };

      const apa = generateApa7(singleAuthor);
      expect(apa).toBe('Lovelace, A. (1843). Deep Multi-Agent Coordination. Cambium Research Platform.');
    });

    it('should format 2 authors with ampersand', () => {
      const twoAuthors: CitationMetadata = {
        title: 'Principles of Quantum Cryptography',
        authors: ['Charles Bennett', 'Gilles Brassard'],
        year: 1984,
      };

      const apa = generateApa7(twoAuthors);
      expect(apa).toContain('Bennett, C., & Brassard, G. (1984).');
    });
  });

  describe('IEEE Generation', () => {
    it('should format IEEE numbered style citation correctly', () => {
      const ieee = generateIeee(sampleArticle);

      expect(ieee).toContain('S. M. Imthiyas, E. Rostova, and M. Vance,');
      expect(ieee).toContain('"Living Materials & Biosensing Microfluidics for Quantum Genomics,"');
      expect(ieee).toContain('*Journal of Computational Biophysics*,');
      expect(ieee).toContain('vol. 42, no. 3, pp. 115-128, 2026.');
    });

    it('should handle grant proposal IEEE style without venue', () => {
      const proposal: CitationMetadata = {
        title: 'ARPA-H Resilience Grant Proposal',
        authors: ['Shaik Imthiyas'],
        year: 2026,
        entryType: 'grant',
      };

      const ieee = generateIeee(proposal);
      expect(ieee).toBe('S. Imthiyas, "ARPA-H Resilience Grant Proposal," 2026.');
    });
  });

  describe('Universal generateCitation dispatcher', () => {
    it('should dispatch to the requested style properly', () => {
      const bib = generateCitation(sampleArticle, 'bibtex');
      const apa = generateCitation(sampleArticle, 'apa');
      const ieee = generateCitation(sampleArticle, 'ieee');

      expect(bib.startsWith('@article')).toBe(true);
      expect(apa.includes('(2026)')).toBe(true);
      expect(ieee.includes('"Living Materials')).toBe(true);
    });
  });
});
