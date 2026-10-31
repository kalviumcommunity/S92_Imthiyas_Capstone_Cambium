import { describe, it, expect, beforeEach } from 'vitest';
import { AuditService } from './audit.service';
import { createHash } from 'crypto';

describe('AuditService & Cryptographic Hash Chain Engine', () => {
  let service: AuditService;

  beforeEach(() => {
    service = new AuditService();
  });

  it('should retrieve audit logs and return total count', async () => {
    const res = await service.getAuditLogs({ limit: 10 });
    expect(res).toBeDefined();
    expect(res.logs.length).toBeGreaterThan(0);
    expect(res.total).toBeGreaterThanOrEqual(res.logs.length);
    expect(res.logs[0]).toHaveProperty('currentHash');
    expect(res.logs[0]).toHaveProperty('previousHash');
  });

  it('should filter audit logs by action', async () => {
    const res = await service.getAuditLogs({ action: 'CREATE' });
    expect(res.logs.every((l) => l.action === 'CREATE')).toBe(true);
  });

  it('should cryptographically verify the SHA-256 ledger integrity from genesis to head', async () => {
    const report = await service.verifyLedgerIntegrity();
    expect(report.status).toBe('INTACT');
    expect(report.totalBlocksVerified).toBeGreaterThan(0);
    expect(report.genesisHash).toBe('0000000000000000000000000000000000000000000000000000000000000000');
    expect(report.tamperedIndex).toBeNull();
    expect(report.merkleRoot).toHaveLength(64);
  });

  it('should export a verifiable signed proof compliant with NIST SP 800-53', async () => {
    const proof = await service.exportSignedProof();
    expect(proof.ledgerId).toContain('CAMBIUM-AUDIT-');
    expect(proof.issuer).toContain('Cambium Scholarly Trust');
    expect(proof.signature).toHaveLength(64);
    expect(proof.records.length).toBeGreaterThan(0);

    // Verify self-consistency of signature
    const expectedSig = createHash('sha256')
      .update(
        JSON.stringify({
          ledgerId: proof.ledgerId,
          issuer: proof.issuer,
          issuedAt: proof.issuedAt,
          complianceCert: proof.complianceCert,
          merkleRoot: proof.merkleRoot,
          totalEvents: proof.totalEvents,
          records: proof.records,
        }),
      )
      .digest('hex');

    expect(proof.signature).toBe(expectedSig);
  });
});

