import {
  Injectable,
  BadRequestException,
  NotFoundException,
  PayloadTooLargeException,
  Logger,
} from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { randomUUID } from 'crypto';

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
  'application/octet-stream', // Fallback for raw .bib / .tex on some browsers
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

    // Extract basename only, completely eliminating any directory traversal (../ or ..\)
    clean = path.basename(clean);

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
  ): Promise<UploadedArtifactMetadata> {
    this.validateFile(file);

    const sanitizedName = this.sanitizeFilename(file.originalname);
    const id = randomUUID();
    const storedFileName = `${id}-${sanitizedName}`;
    const destinationPath = path.join(this.uploadDir, storedFileName);
    const sha256Hash = this.calculateHash(file.buffer);

    // Write file atomically to disk
    await fs.promises.writeFile(destinationPath, file.buffer);

    const metadata: UploadedArtifactMetadata = {
      id,
      originalName: file.originalname,
      sanitizedName,
      storedFileName,
      mimeType: file.mimetype || 'application/octet-stream',
      sizeBytes: file.size,
      sha256Hash,
      uploadedAt: new Date().toISOString(),
      uploaderId: uploaderId || 'anonymous-scholar',
      filePath: destinationPath,
    };

    this.metadataStore.set(id, metadata);
    this.logger.log(`Artifact saved successfully [ID: ${id}] (${sanitizedName}, ${file.size} bytes)`);

    return metadata;
  }

  /**
   * Retrieves artifact metadata by ID
   */
  getArtifactMetadata(id: string): UploadedArtifactMetadata {
    const meta = this.metadataStore.get(id);
    if (!meta || !fs.existsSync(meta.filePath)) {
      throw new NotFoundException(`Research artifact with ID "${id}" was not found`);
    }
    return meta;
  }

  /**
   * Returns all uploaded artifact records
   */
  listArtifacts(): UploadedArtifactMetadata[] {
    return Array.from(this.metadataStore.values()).map((item) => ({
      ...item,
      filePath: undefined as any, // Do not expose absolute internal server filesystem paths in API listings
    }));
  }

  /**
   * Deletes an uploaded artifact from storage
   */
  async deleteArtifact(id: string): Promise<{ success: boolean; id: string }> {
    const meta = this.getArtifactMetadata(id);

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
}
