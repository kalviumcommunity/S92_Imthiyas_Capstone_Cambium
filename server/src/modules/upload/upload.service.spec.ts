import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { UploadService, MAX_FILE_SIZE_BYTES } from './upload.service';
import { BadRequestException, PayloadTooLargeException, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';

describe('UploadService (Curriculum M2.14 File Upload Verification)', () => {
  let service: UploadService;

  beforeEach(() => {
    service = new UploadService();
  });

  describe('Filename Sanitization & Path Traversal Protection', () => {
    it('should strip path traversal sequences and keep only basename', () => {
      const malicious = '../../../../etc/passwd.pdf';
      const clean = service.sanitizeFilename(malicious);
      expect(clean).not.toContain('..');
      expect(clean).not.toContain('/');
      expect(clean).toBe('passwd.pdf');
    });

    it('should strip windows-style backslash traversal', () => {
      const malicious = '..\\..\\windows\\system32\\cmd.exe.pdf';
      const clean = service.sanitizeFilename(malicious);
      expect(clean).not.toContain('..');
      expect(clean).toBe('cmd.exe.pdf');
    });

    it('should strip null bytes and control characters', () => {
      const malicious = 'grant_proposal\x00_2026.pdf';
      const clean = service.sanitizeFilename(malicious);
      expect(clean).toBe('grant_proposal_2026.pdf');
    });

    it('should prevent hidden dotfiles', () => {
      const hidden = '.env.pdf';
      const clean = service.sanitizeFilename(hidden);
      expect(clean.startsWith('.')).toBe(false);
      expect(clean).toBe('artifact.env.pdf');
    });
  });

  describe('Validation & Extension Enforcement', () => {
    it('should accept valid research artifact extensions (.pdf, .docx, .bib, .csv)', () => {
      expect(() =>
        service.validateFile({
          originalname: 'research_paper.pdf',
          size: 1024,
          mimetype: 'application/pdf',
        }),
      ).not.toThrow();

      expect(() =>
        service.validateFile({
          originalname: 'citations.bib',
          size: 2048,
          mimetype: 'text/plain',
        }),
      ).not.toThrow();
    });

    it('should reject executable or script extensions (.exe, .sh, .bat, .php)', () => {
      expect(() =>
        service.validateFile({
          originalname: 'exploit.exe',
          size: 1024,
          mimetype: 'application/octet-stream',
        }),
      ).toThrow(BadRequestException);

      expect(() =>
        service.validateFile({
          originalname: 'script.sh',
          size: 512,
          mimetype: 'text/x-sh',
        }),
      ).toThrow(BadRequestException);
    });

    it('should reject 0-byte empty files', () => {
      expect(() =>
        service.validateFile({
          originalname: 'empty.pdf',
          size: 0,
          mimetype: 'application/pdf',
        }),
      ).toThrow(BadRequestException);
    });

    it('should reject files exceeding 50MB size limit', () => {
      expect(() =>
        service.validateFile({
          originalname: 'giant_dataset.csv',
          size: MAX_FILE_SIZE_BYTES + 1024,
          mimetype: 'text/csv',
        }),
      ).toThrow(PayloadTooLargeException);
    });
  });

  describe('Storage, SHA-256 Hashing & Lifecycle', () => {
    const sampleContent = Buffer.from(
      'CAMBIUM RESEARCH ARTIFACT: Genomic Foundation Model Weights & Benchmark Metrics',
    );
    let createdArtifactId: string;

    it('should calculate valid SHA-256 hash', () => {
      const hash = service.calculateHash(sampleContent);
      expect(hash).toHaveLength(64);
      expect(hash).toMatch(/^[a-f0-9]{64}$/);
    });

    it('should persist artifact, store metadata, and allow retrieval', async () => {
      const metadata = await service.saveArtifact(
        {
          originalname: 'sample_proposal.pdf',
          buffer: sampleContent,
          size: sampleContent.length,
          mimetype: 'application/pdf',
        },
        'user-pi-101',
      );

      expect(metadata).toBeDefined();
      expect(metadata.id).toBeDefined();
      expect(metadata.sanitizedName).toBe('sample_proposal.pdf');
      expect(metadata.sha256Hash).toBe(service.calculateHash(sampleContent));
      expect(fs.existsSync(metadata.filePath)).toBe(true);

      createdArtifactId = metadata.id;

      // Retrieve
      const fetched = service.getArtifactMetadata(createdArtifactId);
      expect(fetched.id).toBe(createdArtifactId);
    });

    it('should throw NotFoundException for non-existent artifact ID', () => {
      expect(() => service.getArtifactMetadata('non-existent-uuid')).toThrow(NotFoundException);
    });

    it('should delete artifact from disk and metadata store', async () => {
      const metadata = await service.saveArtifact(
        {
          originalname: 'to_delete.pdf',
          buffer: sampleContent,
          size: sampleContent.length,
          mimetype: 'application/pdf',
        },
        'user-pi-101',
      );

      const result = await service.deleteArtifact(metadata.id);
      expect(result.success).toBe(true);
      expect(() => service.getArtifactMetadata(metadata.id)).toThrow(NotFoundException);
    });
  });
});
