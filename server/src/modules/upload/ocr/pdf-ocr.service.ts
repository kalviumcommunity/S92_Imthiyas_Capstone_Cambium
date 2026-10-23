import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { Worker } from 'worker_threads';
import * as path from 'path';
import { OcrExtractionResult, processDocument } from './pdf-ocr.worker';

@Injectable()
export class PdfOcrService {
  private readonly logger = new Logger(PdfOcrService.name);
  private readonly workerTimeoutMs = 15000; // 15-second execution boundary

  /**
   * Asynchronously parses legacy multi-column scanned grant PDFs and extracts tables
   * Dispatches heavy CPU parsing to an isolated Node.js Worker Thread to keep event loop responsive.
   */
  async extractPdfTablesAndText(buffer: Buffer): Promise<OcrExtractionResult> {
    const workerScript = path.resolve(__dirname, 'pdf-ocr.worker.js');

    return new Promise((resolve, reject) => {
      // In development / tsx / vitest environments, worker_threads might need compiled JS or direct execution
      try {
        const worker = new Worker(workerScript, {
          workerData: buffer,
        });

        const timer = setTimeout(() => {
          worker.terminate();
          this.logger.warn('PDF OCR Worker timed out (15s boundary exceeded). Using fallback parser.');
          resolve(processDocument(buffer));
        }, this.workerTimeoutMs);

        worker.on('message', (msg: any) => {
          clearTimeout(timer);
          worker.terminate();
          if (msg.success) {
            resolve(msg.result);
          } else {
            this.logger.warn(`Worker parsing error: ${msg.error}. Falling back.`);
            resolve(processDocument(buffer));
          }
        });

        worker.on('error', (err: any) => {
          clearTimeout(timer);
          worker.terminate();
          this.logger.warn(`Worker execution error: ${err?.message || err}. Using in-process sandboxed fallback.`);
          resolve(processDocument(buffer));
        });
      } catch (spawnErr: any) {
        // Fallback for environments where worker script path is virtualized
        this.logger.log('Executing sandboxed OCR parser in-process');
        try {
          const directResult = processDocument(buffer);
          resolve(directResult);
        } catch (err: any) {
          reject(new InternalServerErrorException(`Failed to extract PDF tables: ${err.message}`));
        }
      }
    });
  }
}
