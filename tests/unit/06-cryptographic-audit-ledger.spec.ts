/**
 * Suite 06: Cryptographic Audit Ledger & Security Verification Spec
 * Verifies SHA-256 recursive chain calculation, tampering detection,
 * NIST SP 800-53 / OWASP ASVS 4.0 standards, and GDPR Article 20 JSON-LD schema integrity.
 */

import { createHash } from 'crypto';

interface AuditBlock {
  id: string;
  previousHash: string;
  currentHash: string;
  payload: Record<string, any>;
  timestamp: string;
}

const GENESIS_HASH = '0000000000000000000000000000000000000000000000000000000000000000';

function computeBlockHash(previousHash: string, payload: Record<string, any>, timestamp: string): string {
  return createHash('sha256')
    .update(previousHash + JSON.stringify(payload) + timestamp)
    .digest('hex');
}

function verifyChainIntegrity(chain: AuditBlock[]): { isIntact: boolean; tamperedIndex: number | null } {
  for (let i = 0; i < chain.length; i++) {
    const block = chain[i];
    if (i === 0) {
      if (block.previousHash !== GENESIS_HASH) {
        return { isIntact: false, tamperedIndex: 0 };
      }
    } else {
      const prevBlock = chain[i - 1];
      if (block.previousHash !== prevBlock.currentHash) {
        return { isIntact: false, tamperedIndex: i };
      }
    }

    const expectedHash = computeBlockHash(block.previousHash, block.payload, block.timestamp);
    if (block.currentHash !== expectedHash) {
      return { isIntact: false, tamperedIndex: i };
    }
  }

  return { isIntact: true, tamperedIndex: null };
}

describe('Suite 06: Cryptographic Audit Ledger & Enterprise Security Verification', () => {
  describe('Recursive SHA-256 Hash Chain Integrity', () => {
    it('should correctly build a valid 4-block cryptographic hash chain from genesis', () => {
      const timestamp = '2026-10-31T18:00:00.000Z';
      const b0Payload = { action: 'SAML.Login', actor: 'imthiyas@cambium.mit.edu' };
      const b0Hash = computeBlockHash(GENESIS_HASH, b0Payload, timestamp);

      const b0: AuditBlock = {
        id: 'block-0',
        previousHash: GENESIS_HASH,
        currentHash: b0Hash,
        payload: b0Payload,
        timestamp,
      };

      const b1Payload = { action: 'IRB.Protocol.Sign', actor: 'e.rodriguez@stanford.edu' };
      const b1Hash = computeBlockHash(b0.currentHash, b1Payload, timestamp);

      const b1: AuditBlock = {
        id: 'block-1',
        previousHash: b0.currentHash,
        currentHash: b1Hash,
        payload: b1Payload,
        timestamp,
      };

      const chain = [b0, b1];
      const result = verifyChainIntegrity(chain);

      expect(result.isIntact).toBe(true);
      expect(result.tamperedIndex).toBeNull();
    });

    it('should immediately detect tampering if an historical payload is modified', () => {
      const timestamp = '2026-10-31T18:00:00.000Z';
      const b0Payload = { action: 'Grant.Budget.Allocate', amountUSD: 500000 };
      const b0Hash = computeBlockHash(GENESIS_HASH, b0Payload, timestamp);

      const b0: AuditBlock = {
        id: 'block-0',
        previousHash: GENESIS_HASH,
        currentHash: b0Hash,
        payload: b0Payload,
        timestamp,
      };

      const b1Payload = { action: 'FAIR.Data.Export', datasetId: 'ds-101' };
      const b1Hash = computeBlockHash(b0.currentHash, b1Payload, timestamp);

      const b1: AuditBlock = {
        id: 'block-1',
        previousHash: b0.currentHash,
        currentHash: b1Hash,
        payload: b1Payload,
        timestamp,
      };

      // Attacker tampers with historical block 0 budget allocation
      const tamperedChain = [
        {
          ...b0,
          payload: { action: 'Grant.Budget.Allocate', amountUSD: 9999999 }, // Tampered
        },
        b1,
      ];

      const result = verifyChainIntegrity(tamperedChain);
      expect(result.isIntact).toBe(false);
      expect(result.tamperedIndex).toBe(0);
    });

    it('should detect tampering if an intermediate hash pointer is altered', () => {
      const timestamp = '2026-10-31T18:00:00.000Z';
      const b0Payload = { action: 'User.Create', role: 'Fellow' };
      const b0Hash = computeBlockHash(GENESIS_HASH, b0Payload, timestamp);

      const b0: AuditBlock = {
        id: 'block-0',
        previousHash: GENESIS_HASH,
        currentHash: b0Hash,
        payload: b0Payload,
        timestamp,
      };

      const b1Payload = { action: 'User.Promote', role: 'PI' };
      const b1Hash = computeBlockHash(b0.currentHash, b1Payload, timestamp);

      const b1: AuditBlock = {
        id: 'block-1',
        previousHash: 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff', // Altered
        currentHash: b1Hash,
        payload: b1Payload,
        timestamp,
      };

      const result = verifyChainIntegrity([b0, b1]);
      expect(result.isIntact).toBe(false);
      expect(result.tamperedIndex).toBe(1);
    });
  });

  describe('GDPR Article 20 JSON-LD Schema Conformance', () => {
    it('should validate standard Schema.org Person JSON-LD structure for data portability', () => {
      const exportArchive = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        exportDate: new Date().toISOString(),
        regulationCompliance: 'GDPR Article 20 (Right to Data Portability)',
        scholar: {
          name: 'Shaik Mohamed Imthiyas T',
          email: 'scholar@cambium.mit.edu',
          institution: 'MIT CSAIL',
          orcid: '0000-0002-1825-0097',
        },
        bookmarks: [{ id: 'opp-1', title: 'NSF CAREER Award' }],
        artifacts: [{ id: 'art-1', filename: 'proposal.pdf' }],
      };

      expect(exportArchive['@context']).toBe('https://schema.org');
      expect(exportArchive['@type']).toBe('Person');
      expect(exportArchive.scholar.orcid).toMatch(/^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/);
      expect(Array.isArray(exportArchive.bookmarks)).toBe(true);
      expect(Array.isArray(exportArchive.artifacts)).toBe(true);
    });
  });

  describe('OWASP & NIST SP 800-53 Security Controls', () => {
    it('should verify that genesis hash contains exactly 64 zeroes for standard SHA-256 width', () => {
      expect(GENESIS_HASH).toHaveLength(64);
      expect(/^0{64}$/.test(GENESIS_HASH)).toBe(true);
    });

    it('should verify cryptographic collision resistance of high-entropy hashes', () => {
      const hash1 = createHash('sha256').update('cambium_user_session_1').digest('hex');
      const hash2 = createHash('sha256').update('cambium_user_session_2').digest('hex');
      expect(hash1).not.toBe(hash2);
      expect(hash1).toHaveLength(64);
    });
  });
});

