import { IsOptional, IsString, IsEnum, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  ContributionEventType,
  ContributionVisibility,
} from '../entities/research-contribution.entity';

export class GetContributionsQueryDto {
  @ApiPropertyOptional({ description: 'Filter by scholar user UUID (defaults to current viewer or primary fellow)' })
  @IsOptional()
  @IsString()
  actorId?: string;

  @ApiPropertyOptional({ description: 'Target calendar year (e.g. 2026, 2025, or all if omitted)' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1900)
  @Max(2100)
  year?: number;

  @ApiPropertyOptional({ description: 'Start date boundary in ISO-8601 format' })
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiPropertyOptional({ description: 'End date boundary in ISO-8601 format' })
  @IsOptional()
  @IsString()
  endDate?: string;

  @ApiPropertyOptional({
    description: 'Researcher calendar timezone for daily aggregation (defaults to UTC)',
    default: 'UTC',
  })
  @IsOptional()
  @IsString()
  timezone?: string = 'UTC';

  @ApiPropertyOptional({
    enum: ContributionEventType,
    description: 'Filter by specific eligible research event type',
  })
  @IsOptional()
  @IsEnum(ContributionEventType)
  eventType?: ContributionEventType;

  @ApiPropertyOptional({
    enum: ContributionVisibility,
    description: 'Filter by visibility tier (PUBLIC, LAB_ONLY, PRIVATE)',
  })
  @IsOptional()
  @IsEnum(ContributionVisibility)
  visibility?: ContributionVisibility;
}
