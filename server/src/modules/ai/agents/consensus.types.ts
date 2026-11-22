/**
 * Cambium Research Platform — Multi-Agent Consensus Engine Types (Milestone 12 Draft)
 */

export enum ReviewerPersona {
  PRIMARY_NOVELTY = 'PRIMARY_NOVELTY',
  STATISTICAL_SKEPTIC = 'STATISTICAL_SKEPTIC',
  REPRODUCIBILITY_AUDITOR = 'REPRODUCIBILITY_AUDITOR',
  ETHICS_SAFETY = 'ETHICS_SAFETY',
  SYNTHESIS_ARBITER = 'SYNTHESIS_ARBITER',
}

export interface AgentCritiqueTurn {
  turnIndex: number;
  persona: ReviewerPersona;
  targetSection: string;
  claimAnalyzed: string;
  evidenceStrength: number; // 1 to 5 scale
  critiqueText: string;
  suggestedRevision?: string;
  citedDoi?: string;
}

export interface PeerReviewConsensusReport {
  manuscriptId: string;
  totalDebateTurns: number;
  calibratedScores: {
    methodologicalSoundness: number;
    statisticalPower: number;
    reproducibility: number;
    novelty: number;
    overallConsensus: number;
  };
  recommendation: 'STRONG_ACCEPT' | 'ACCEPT_WITH_REVISION' | 'MAJOR_REVISION' | 'REJECT';
  arbitrationSummary: string;
  turnHistory: AgentCritiqueTurn[];
  completedAt: string;
}
