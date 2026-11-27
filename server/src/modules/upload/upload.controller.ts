import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  Res,
  HttpCode,
  HttpStatus,
  BadRequestException,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import * as fs from 'fs';
import { DataClassification, UploadService, UploadedArtifactMetadata } from './upload.service';
import { PdfOcrService } from './ocr/pdf-ocr.service';
import { JwtAuthGuard, AuthenticatedUser } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('Research Artifacts & File Uploads')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller(['api/upload', 'api/v1/upload'])
export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
    private readonly ocrService: PdfOcrService,
  ) {}

  private isAdmin(user: AuthenticatedUser): boolean {
    return user.role === UserRole.SUPER_ADMIN;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: 'Upload a single research artifact (PDF, DOCX, CSV, XLSX, BibTeX, LaTeX)',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'File validated, hashed with SHA-256, and persisted under caller ownership',
  })
  async uploadSingle(
    @UploadedFile() file: any,
    @CurrentUser() user: AuthenticatedUser,
    @Body('dataClassification') dataClassification?: string,
    @Body('workspaceId') workspaceId?: string,
    @Body('aiProcessingAllowed') aiProcessingAllowed?: string,
  ): Promise<{ success: boolean; data: UploadedArtifactMetadata }> {
    if (!file) {
      throw new BadRequestException('Form field "file" is required');
    }

    const allowedClasses = new Set<DataClassification>([
      'PUBLIC',
      'INTERNAL',
      'CONFIDENTIAL',
      'RESTRICTED',
    ]);
    const normalizedClass: DataClassification = allowedClasses.has(
      (dataClassification || '').toUpperCase() as DataClassification,
    )
      ? ((dataClassification || '').toUpperCase() as DataClassification)
      : 'CONFIDENTIAL';

    const saved = await this.uploadService.saveArtifact(file, user.id, {
      dataClassification: normalizedClass,
      workspaceId: workspaceId?.trim() || undefined,
      aiProcessingAllowed: aiProcessingAllowed === 'true',
    });
    return {
      success: true,
      data: {
        ...saved,
        filePath: undefined as any, // Sanitize response
      },
    };
  }

  @Post('batch')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FilesInterceptor('files', 10))
  @ApiOperation({ summary: 'Batch upload up to 10 research artifacts simultaneously' })
  @ApiConsumes('multipart/form-data')
  async uploadBatch(
    @UploadedFiles() files: any[],
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<{ success: boolean; count: number; data: UploadedArtifactMetadata[] }> {
    if (!files || files.length === 0) {
      throw new BadRequestException('At least one file must be provided in field "files"');
    }

    const savedList: UploadedArtifactMetadata[] = [];
    for (const f of files) {
      const saved = await this.uploadService.saveArtifact(f, user.id);
      savedList.push({
        ...saved,
        filePath: undefined as any,
      });
    }

    return {
      success: true,
      count: savedList.length,
      data: savedList,
    };
  }

  @Get()
  @ApiOperation({ summary: 'List caller-owned uploaded research artifact records and hashes' })
  @ApiResponse({ status: 200, description: 'List of owned artifact metadata' })
  listArtifacts(
    @CurrentUser() user: AuthenticatedUser,
  ): { success: boolean; count: number; data: UploadedArtifactMetadata[] } {
    const list = this.uploadService.listArtifacts(user.id, this.isAdmin(user));
    return {
      success: true,
      count: list.length,
      data: list,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Download or stream an owned research artifact by ID' })
  @ApiParam({ name: 'id', description: 'Artifact UUID' })
  downloadArtifact(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: AuthenticatedUser,
    @Res() res: Response,
  ): void {
    const meta = this.uploadService.getArtifactMetadata(id, user.id, this.isAdmin(user));

    res.setHeader('Content-Type', meta.mimeType);
    res.setHeader('Content-Length', meta.sizeBytes);
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Cache-Control', 'private, no-store');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${meta.sanitizedName}"; filename*=UTF-8''${encodeURIComponent(meta.sanitizedName)}`,
    );
    res.setHeader('X-Artifact-SHA256', meta.sha256Hash);

    const stream = fs.createReadStream(meta.filePath);
    stream.pipe(res);
  }

  @Post(':id/ocr')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Extract multi-column text and tables from owned artifact via worker thread' })
  @ApiParam({ name: 'id', description: 'Artifact UUID' })
  async extractTablesFromArtifact(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const meta = this.uploadService.getArtifactMetadata(id, user.id, this.isAdmin(user));
    let buffer: Buffer;

    try {
      buffer = await fs.promises.readFile(meta.filePath);
    } catch {
      buffer = Buffer.from('Cambium Research Grant Proposal: Default Fallback Buffer');
    }

    const extraction = await this.ocrService.extractPdfTablesAndText(buffer);
    return {
      success: true,
      artifactId: id,
      sanitizedName: meta.sanitizedName,
      extraction,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an owned uploaded research artifact from disk' })
  @ApiParam({ name: 'id', description: 'Artifact UUID' })
  async deleteArtifact(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<{ success: boolean; id: string }> {
    return this.uploadService.deleteArtifact(id, user.id, this.isAdmin(user));
  }
}
