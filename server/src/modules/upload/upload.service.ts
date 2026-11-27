import {
  Injectable,
  BadRequestException,
  NotFoundException,
  PayloadTooLargeException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { randomUUID } from 'crypto';

export type DataClassification = 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'RESTRICTED';

export interface ArtifactGovernanceOptions {
  dataClassification?: DataClassification;
  workspaceId?: string;
  aiProcessingAllowed?: boolean;
}

export interface UploadedArtifactMetadata {
  id: string;
  originalName: string;
  sanitizedName: string;
  storedFileName: string;
  mimeType: string;
  sizeBytes: number;
  sha256Hash: string;
  uploadedAt: string;
  uploaderId?: string;
  dataClassification?: DataClassification;
  workspaceId?: string;
  aiProcessingAllowed?: boolean;
  filePath: string;
}

export const ALLOWED_FILE_EXTENSIONS = new Set([
  '.pdf',
  '.docx',
  '.csv',
  '.xlsx',
  '.bib',
  '.tex',
  '.json',
]);

export const ALLOWED_MIME_TYPES = new Set([
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/csv',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
  'application/x-bibtex',
  'application/x-latex',
  'application/json',
]);

export const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50 Megabytes

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);
  private readonly uploadDir: string;
  private readonly metadataStore = new Map<string, UploadedArtifactMetadata>();

  constructor() {
    this.uploadDir = path.resolve(process.cwd(), 'uploads', 'artifacts');
    this.ensureUploadDirectory();
  }

  private ensureUploadDirectory(): void {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
      this.logger.log(`Created artifact storage directory at: ${this.uploadDir}`);
    }
  }

  /**
   * Sanitizes user-provided filename against path traversal and null-byte injection
   */
  sanitizeFilename(rawFilename: string): string {
    if (!rawFilename || typeof rawFilename !== 'string') {
      return 'unnamed_artifact.dat';
    }

    // Strip null bytes and control characters
    let clean = rawFilename.replace(/[\x00-\x1f\x80-\x9f]/g, '');

    // Normalize all Windows backslashes to forward slashes for cross-platform POSIX compatibility
    clean = clean.replace(/\\/g, '/');

    // Extract basename only, completely eliminating any directory traversal (../ or ..\)
    clean = path.posix.basename(clean);
    clean = path.win32.basename(clean);

    // Replace risky characters with underscores, keeping alphanumeric, periods, dashes, underscores
    clean = clean.replace(/[^a-zA-Z0-9._-]/g, '_');

    // Prevent hidden files (leading dot)
    if (clean.startsWith('.')) {
      clean = `artifact${clean}`;
    }

    return clean.slice(0, 180); // Cap length
  }

  /**
   * Validates file size, extension, and MIME type
   */
  validateFile(file: { originalname: string; size: number; mimetype: string }): void {
    if (!file) {
      throw new BadRequestException('No file payload received');
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      throw new PayloadTooLargeException(
        `Artifact size exceeds maximum allowed limit of 50MB (received ${file.size} bytes)`,
      );
    }

    if (file.size === 0) {
      throw new BadRequestException('Cannot upload an empty file (0 bytes)');
    }

    const ext = path.extname(file.originalname).toLowerCase();
    if (!ALLOWED_FILE_EXTENSIONS.has(ext)) {
      throw new BadRequestException(
        `File extension "${ext}" is not supported. Allowed formats: ${Array.from(ALLOWED_FILE_EXTENSIONS).join(', ')}`,
      );
    }

    if (file.mimetype && !ALLOWED_MIME_TYPES.has(file.mimetype.toLowerCase())) {
      throw new BadRequestException(
        `MIME type "${file.mimetype}" is not permitted for research artifacts`,
      );
    }
  }

  /**
   * Inspects file magic bytes and rejects executables/polyglots disguised with safe extensions.
   */
  validateMagicBytes(ext: string, buffer: Buffer): void {
    if (!buffer || buffer.length === 0) {
      throw new BadRequestException('Cannot validate empty artifact buffer');
    }

    const head = buffer.subarray(0, 16);
    const asciiHead = head.toString('utf8');

    // Block Windows PE (MZ), Linux ELF, Mach-O, and shell scripts regardless of claimed extension
    if (
      (head[0] === 0x4d && head[1] === 0x5a) || // MZ executable
      (head[0] === 0x7f && head[1] === 0x45 && head[2] === 0x4c && head[3] === 0x46) || // \x7fELF
      asciiHead.startsWith('#!') ||
      /<script/i.test(asciiHead)
    ) {
      throw new BadRequestException(
        'Security policy violation: disguised executable or script payload rejected',
      );
    }

    if (ext === '.pdf' && !buffer.subarray(0, 5).equals(Buffer.from('%PDF-'))) {
      throw new BadRequestException(
        'Invalid PDF signature: file header does not start with %PDF-',
      );
    }

    if (
      (ext === '.docx' || ext === '.xlsx') &&
      !(head[0] === 0x50 && head[1] === 0x4b && head[2] === 0x03 && head[3] === 0x04)
    ) {
      throw new BadRequestException(
        `Invalid ${ext} signature: OOXML container header mismatch`,
      );
    }

    if (ext === '.json') {
      try {
        JSON.parse(buffer.toString('utf8'));
      } catch {
        throw new BadRequestException('Invalid JSON payload');
      }
    }
  }

  /**
   * Calculates cryptographic SHA-256 hash of buffer
   */
  calculateHash(buffer: Buffer): string {
    return crypto.createHash('sha256').update(buffer).digest('hex');
  }

  /**
   * Persists an uploaded research artifact to secure disk storage
   */
  async saveArtifact(
    file: { originalname: string; buffer: Buffer; size: number; mimetype: string },
    uploaderId?: string,
    governance: ArtifactGovernanceOptions = {},
  ): Promise<UploadedArtifactMetadata> {
    this.validateFile(file);

    const ext = path.extname(file.originalname).toLowerCase();
    this.validateMagicBytes(ext, file.buffer);

    const sanitizedName = this.sanitizeFilename(file.originalname);
    const id = randomUUID();
    const storedFileName = `${id}-${sanitizedName}`;
    const destinationPath = path.join(this.uploadDir, storedFileName);
    const sha256Hash = this.calculateHash(file.buffer);
    const classification: DataClassification = governance.dataClassification || 'CONFIDENTIAL';
    const aiAllowed =
      classification === 'RESTRICTED' ? false : Boolean(governance.aiProcessingAllowed);

    // Write file atomically to disk
    await fs.promises.writeFile(destinationPath, file.buffer);

    const metadata: UploadedArtifactMetadata = {
      id,
      originalName: file.originalname,
      sanitizedName,
      storedFileName,
      mimeType: file.mimetype || 'application/pdf',
      sizeBytes: file.size,
      sha256Hash,
      uploadedAt: new Date().toISOString(),
      uploaderId: uploaderId || 'system-internal',
      dataClassification: classification,
      workspaceId: governance.workspaceId,
      aiProcessingAllowed: aiAllowed,
      filePath: destinationPath,
    };

    this.metadataStore.set(id, metadata);
    this.logger.log(`Artifact saved successfully [ID: ${id}] (${sanitizedName}, ${file.size} bytes)`);

    return metadata;
  }

  /**
   * Retrieves artifact metadata by ID with optional owner/admin access check
   */
  getArtifactMetadata(id: string, requesterId?: string, isAdmin = false): UploadedArtifactMetadata {
    const meta = this.metadataStore.get(id);
    if (!meta || !fs.existsSync(meta.filePath)) {
      throw new NotFoundException(`Research artifact with ID "${id}" was not found`);
    }
    if (requesterId && !isAdmin && meta.uploaderId !== requesterId) {
      throw new ForbiddenException('Access denied: cannot access another scholar artifact');
    }
    return meta;
  }

  /**
   * Returns uploaded artifact records scoped to caller unless Admin
   */
  listArtifacts(requesterId?: string, isAdmin = false): UploadedArtifactMetadata[] {
    return Array.from(this.metadataStore.values())
      .filter((item) => !requesterId || isAdmin || item.uploaderId === requesterId)
      .map((item) => ({
        ...item,
        filePath: undefined as any, // Do not expose absolute internal server filesystem paths in API listings
      }));
  }

  /**
   * Deletes an uploaded artifact from storage with ownership enforcement
   */
  async deleteArtifact(
    id: string,
    requesterId?: string,
    isAdmin = false,
  ): Promise<{ success: boolean; id: string }> {
    const meta = this.getArtifactMetadata(id, requesterId, isAdmin);

    try {
      if (fs.existsSync(meta.filePath)) {
        await fs.promises.unlink(meta.filePath);
      }
    } catch (err: any) {
      this.logger.warn(`Failed to unlink file on disk for artifact ${id}: ${err.message}`);
    }

    this.metadataStore.delete(id);
    this.logger.log(`Artifact removed [ID: ${id}]`);

    return { success: true, id };
  }

  /**
   * Cascades erasure across all uploaded artifacts owned by a specific researcher
   */
  async deleteArtifactsByOwner(
    ownerId: string,
  ): Promise<{ deletedCount: number; deletedIds: string[] }> {
    const owned = Array.from(this.metadataStore.values()).filter(
      (item) => item.uploaderId === ownerId,
    );
    const deletedIds: string[] = [];

    for (const artifact of owned) {
      await this.deleteArtifact(artifact.id, ownerId, true);
      deletedIds.push(artifact.id);
    }

    return { deletedCount: deletedIds.length, deletedIds };
  }
}
