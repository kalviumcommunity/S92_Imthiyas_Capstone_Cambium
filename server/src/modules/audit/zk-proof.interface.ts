/**
 * Cambium Research Platform — Zero-Knowledge Compliance Types (Milestone 11 Draft)
 * Standardized for Groth16 / Plonk Succinct Non-Interactive Proofs
 */

export interface ZkComplianceProof {
  proofId: string;
  projectId: string;
  funderId: string;
  complianceStandard: 'NIH_IRB_45CFR46' | 'NSF_PAPPG_2026' | 'HORIZON_EUROPE_ETHICS';
  publicInputs: {
    rootHash: string;
    timestamp: number;
    institutionDid: string;
  };
  proof: {
    pi_a: [string, string, string];
    pi_b: [[string, string], [string, string], [string, string]];
    pi_c: [string, string, string];
    protocol: 'groth16';
    curve: 'bn128';
  };
  verified: boolean;
  anchoredBlockIndex?: number;
}

export interface ZkVerificationResult {
  valid: boolean;
  latencyMs: number;
  verifiedAt: string;
  signerInstitution: string;
}
