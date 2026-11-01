import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  IsArray,
  IsDateString,
  MaxLength,
  MinLength,
  IsUrl,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ContributionEventType,
  ContributionVisibility,
} from '../entities/research-contribution.entity';

export class CreateManualContributionDto {
  @ApiProperty({
    description: 'Title or concise scholarly description of the completed research milestone',
    example: 'Validation of diffusion kriging model on ERA5 spatiotemporal telemetry',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  title: string;

  @ApiProperty({
    enum: ContributionEventType,
    description: 'Eligible research event category',
    example: ContributionEventType.EXPERIMENT_MILESTONE,
  })
  @IsNotEmpty()
  @IsEnum(ContributionEventType)
  eventType: ContributionEventType;

  @ApiProperty({
    description: 'Timestamp when the research event occurred (ISO 8601 UTC)',
    example: '2026-03-15T14:30:00.000Z',
  })
  @IsNotEmpty()
  @IsDateString()
  occurredAt: string;

  @ApiPropertyOptional({
    description: 'Stable work identifier (DOI, arXiv ID, or Zenodo accession) for grouping distinct outputs',
    example: 'doi:10.1016/j.cels.2026.01.004',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  outputRef?: string;

  @ApiPropertyOptional({
    description: 'Associated project UUID if recorded against a Cambium collaborative workspace',
  })
  @IsOptional()
  @IsString()
  projectId?: string;

  @ApiPropertyOptional({
    description: 'Verifiable external evidence link (DOI, OSF repository, Zenodo archive, or lab notebook link)',
    example: 'https://doi.org/10.5281/zenodo.10829102',
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  evidenceUrl?: string;

  @ApiPropertyOptional({
    description: 'CRediT author roles fulfilled for this milestone (e.g. Investigation, Methodology, Data curation)',
    type: [String],
    example: ['Methodology', 'Formal analysis', 'Investigation'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  creditRoles?: string[];

  @ApiPropertyOptional({
    enum: ContributionVisibility,
    description: 'Visibility level (PUBLIC, LAB_ONLY, PRIVATE)',
    default: ContributionVisibility.PUBLIC,
  })
  @IsOptional()
  @IsEnum(ContributionVisibility)
  visibility?: ContributionVisibility = ContributionVisibility.PUBLIC;

  @ApiPropertyOptional({
    description: 'Scholarly context metadata, journal title, or experiment parameters',
    default: {},
  })
  @IsOptional()
  metadata?: Record<string, any>;
}

