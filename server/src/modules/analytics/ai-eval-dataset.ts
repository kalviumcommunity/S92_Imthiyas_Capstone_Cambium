export const EVAL_DATASET_VERSION = '2026-11.v1';

export interface RagEvalCase {
  id: string;
  query: string;
  expectedKeywords: string[];
  expectAbstention: boolean;
}

export interface RagEvalReport {
  datasetVersion: string;
  evaluatedAt: string;
  totalCases: number;
  recallAt3Pct: number;
  precisionAt3Pct: number;
  citationCompletenessPct: number;
  abstentionAccuracyPct: number;
  caseResults: Array<{
    id: string;
    matchedExpected: boolean;
    precisionAt3: number;
    hasCitation: boolean;
    abstentionCorrect: boolean;
  }>;
}

export const SYNTHETIC_EVAL_CORPUS = [
  {
    id: 'opp-nsf-career',
    title: 'NSF CAREER Faculty Early Development Program',
    funder: 'National Science Foundation',
    text: 'Supports early-career faculty integrating computational biology, reproducibility standards, and undergraduate mentorship.',
  },
  {
    id: 'opp-nih-r01',
    title: 'NIH R01 Translational Oncology Biomarkers',
    funder: 'National Institutes of Health',
    text: 'Clinical biomarker discovery, IRB human subjects compliance, and multi-site prospective validation studies.',
  },
  {
    id: 'opp-horizon-climate',
    title: 'Horizon Europe Climate Adaptation & Soil Carbon Consortium',
    funder: 'European Commission',
    text: 'Cross-border consortia researching carbon sequestration, satellite telemetry, and FAIR open data repositories.',
  },
  {
    id: 'opp-wellcome-open',
    title: 'Wellcome Discovery Award in Antimicrobial Resistance',
    funder: 'Wellcome Trust',
    text: 'Long-term bold research on bacterial genomics, structural proteomics, and global infectious disease surveillance.',
  },
];

export const RAG_EVAL_CASES: RagEvalCase[] = [
  {
    id: 'eval-nsf-career',
    query: 'early career faculty computational biology reproducibility grant',
    expectedKeywords: ['nsf career', 'computational biology'],
    expectAbstention: false,
  },
  {
    id: 'eval-nih-irb',
    query: 'clinical oncology biomarker IRB compliance',
    expectedKeywords: ['nih r01', 'biomarker', 'irb'],
    expectAbstention: false,
  },
  {
    id: 'eval-horizon-soil',
    query: 'European consortium soil carbon FAIR open data',
    expectedKeywords: ['horizon europe', 'soil carbon'],
    expectAbstention: false,
  },
  {
    id: 'eval-wellcome-amr',
    query: 'antimicrobial resistance structural proteomics discovery grant',
    expectedKeywords: ['wellcome', 'antimicrobial'],
    expectAbstention: false,
  },
  {
    id: 'eval-abstention-unrelated',
    query: 'recipes for sourdough croissants and espresso calibration',
    expectedKeywords: [],
    expectAbstention: true,
  },
];

/**
 * Runs deterministic lexical + keyword benchmark scoring across versioned RAG evaluation cases.
 */
export function runDeterministicRagEvaluation(now = new Date()): RagEvalReport {
  const results = RAG_EVAL_CASES.map((tc) => {
    const tokens = tc.query
      .toLowerCase()
      .split(/\W+/)
      .filter((t) => t.length >= 3);

    const scored = SYNTHETIC_EVAL_CORPUS.map((doc) => {
      const hay = `${doc.title} ${doc.funder} ${doc.text}`.toLowerCase();
      const hits = tokens.filter((tok) => hay.includes(tok)).length;
      return { doc, score: hits };
    })
      .filter((d) => d.score >= 2)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    if (tc.expectAbstention) {
      const abstained = scored.length === 0;
      return {
        id: tc.id,
        matchedExpected: abstained,
        precisionAt3: abstained ? 1 : 0,
        hasCitation: true,
        abstentionCorrect: abstained,
      };
    }

    const relevantHits = scored.filter((s) => {
      const hay = `${s.doc.title} ${s.doc.text}`.toLowerCase();
      return tc.expectedKeywords.some((kw) => hay.includes(kw));
    }).length;

    const matchedExpected = relevantHits > 0;
    const precisionAt3 = scored.length > 0 ? relevantHits / scored.length : 0;
    const hasCitation = scored.length > 0 && Boolean(scored[0].doc.funder);

    return {
      id: tc.id,
      matchedExpected,
      precisionAt3,
      hasCitation,
      abstentionCorrect: true,
    };
  });

  const nonAbstain = results.filter((_, idx) => !RAG_EVAL_CASES[idx].expectAbstention);
  const abstainCases = results.filter((_, idx) => RAG_EVAL_CASES[idx].expectAbstention);

  return {
    datasetVersion: EVAL_DATASET_VERSION,
    evaluatedAt: now.toISOString(),
    totalCases: results.length,
    recallAt3Pct: Number(
      ((nonAbstain.filter((r) => r.matchedExpected).length / Math.max(1, nonAbstain.length)) * 100).toFixed(1),
    ),
    precisionAt3Pct: Number(
      (
        (nonAbstain.reduce((s, r) => s + r.precisionAt3, 0) / Math.max(1, nonAbstain.length)) *
        100
      ).toFixed(1),
    ),
    citationCompletenessPct: Number(
      ((nonAbstain.filter((r) => r.hasCitation).length / Math.max(1, nonAbstain.length)) * 100).toFixed(1),
    ),
    abstentionAccuracyPct: Number(
      ((abstainCases.filter((r) => r.abstentionCorrect).length / Math.max(1, abstainCases.length)) * 100).toFixed(1),
    ),
    caseResults: results,
  };
}
