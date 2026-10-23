import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { PdfOcrService } from './ocr/pdf-ocr.service';

@Module({
  controllers: [UploadController],
  providers: [UploadService, PdfOcrService],
  exports: [UploadService, PdfOcrService],
})
export class UploadModule {}
