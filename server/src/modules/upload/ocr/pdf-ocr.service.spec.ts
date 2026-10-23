import { describe, it, expect, beforeEach } from 'vitest';
import { PdfOcrService } from './pdf-ocr.service';

describe('PdfOcrService (Sandboxed Background PDF OCR Worker)', () => {
  let service: PdfOcrService;

  beforeEach(() => {
    service = new PdfOcrService();
  });

  const sampleFederalRfp = Buffer.from(`
NATIONAL SCIENCE FOUNDATION
DIRECTORATE FOR COMPUTER AND INFORMATION SCIENCE AND ENGINEERING
SOLICITATION: NSF 26-501
CFDA: 47.070
Total Funding: $1,200,000
Closing Date: November 15, 2026

EXECUTIVE SUMMARY                            BUDGET & ALLOCATION SCHEDULE
This solicitation invites high-risk          Direct Costs | Personnel | Cost Share
research proposals in biological             Senior Personnel | $180,000 | $0
foundation models and neuro-symbolic         Postdoctoral Scholars | $95,000 | $0
hybrid reasoning systems.                    Equipment & Computation | $75,000 | $15,000
                                             Indirect Costs (F&A) | $189,000 | $0

ELIGIBILITY CRITERIA
Institutions of Higher Education (IHEs) accredited in and having a campus in the US.
Non-profit, non-academic organizations: Independent museums, observatories, research labs.
  `);

  it('should extract federal solicitation number, CFDA code, and funding ceiling', async () => {
    const result = await service.extractPdfTablesAndText(sampleFederalRfp);

    expect(result).toBeDefined();
    expect(result.solicitationId).toContain('NSF 26-501');
    expect(result.cfdaNumber).toBe('47.070');
    expect(result.fundingCeiling).toBe('$1,200,000');
    expect(result.deadline).toBe('November 15, 2026');
  });

  it('should parse multi-column layout into discrete column paragraphs', async () => {
    const result = await service.extractPdfTablesAndText(sampleFederalRfp);

    expect(result.columns).toHaveLength(2);
    expect(result.columns[0].paragraphs.length).toBeGreaterThan(0);
    expect(result.columns[1].paragraphs.length).toBeGreaterThan(0);
  });

  it('should extract structured budget table headers and cost rows', async () => {
    const result = await service.extractPdfTablesAndText(sampleFederalRfp);

    expect(result.tables.length).toBeGreaterThan(0);
    const budgetTable = result.tables[0];
    expect(budgetTable.headers.length).toBeGreaterThanOrEqual(2);
    expect(budgetTable.rows.length).toBeGreaterThan(0);
  });

  it('should handle small or unstructured text buffers gracefully without crashing', async () => {
    const smallBuffer = Buffer.from('Minimal grant note without tables.');
    const result = await service.extractPdfTablesAndText(smallBuffer);

    expect(result).toBeDefined();
    expect(result.totalWordCount).toBe(5);
    expect(result.tables.length).toBeGreaterThan(0); // Returns default structured schedule
    expect(result.processingTimeMs).toBeGreaterThanOrEqual(0);
  });
});
