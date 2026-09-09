import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsArray, IsDateString, IsUrl } from 'class-validator';
import { OpportunityType } from '../entities/research-opportunity.entity';

export class CreateOpportunityDto {
  @ApiProperty({ description: 'Title of research opportunity', example: 'Global AI Research Grant 2026' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ enum: OpportunityType, description: 'Type of opportunity', example: OpportunityType.GRANT })
  @IsEnum(OpportunityType)
  @IsNotEmpty()
  type: OpportunityType;

  @ApiProperty({ description: 'Sponsoring institution or organization', example: 'National Science Foundation' })
  @IsString()
  @IsNotEmpty()
  organization: string;

  @ApiPropertyOptional({ description: 'Submission deadline in ISO 8601 string format', example: '2026-11-30T23:59:59Z' })
  @IsOptional()
  @IsDateString()
  deadline?: string;

  @ApiPropertyOptional({ description: 'Detailed opportunity description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Official external link or portal', example: 'https://nsf.gov/grants/ai-2026' })
  @IsOptional()
  @IsString()
  link?: string;

  @ApiPropertyOptional({ description: 'Associated domain tags', example: ['AI', 'Machine Learning'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

export class UpdateOpportunityDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ enum: OpportunityType })
  @IsOptional()
  @IsEnum(OpportunityType)
  type?: OpportunityType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  organization?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  deadline?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  link?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

export class FilterOpportunityDto {
  @ApiPropertyOptional({ enum: OpportunityType })
  @IsOptional()
  @IsEnum(OpportunityType)
  type?: OpportunityType;

  @ApiPropertyOptional({ description: 'Search term against title, organization, and description' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Filter by specific taxonomy tag' })
  @IsOptional()
  @IsString()
  tag?: string;
}

export class RecommendationQueryDto {
  @ApiPropertyOptional({ type: [String], description: 'User research interests for candidate matching' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  interests?: string[];

  @ApiPropertyOptional({ enum: OpportunityType })
  @IsOptional()
  @IsEnum(OpportunityType)
  type?: OpportunityType;

  @ApiPropertyOptional({
    type: [Number],
    description: '1536-dimensional query embedding vector for pgvector semantic search',
  })
  @IsOptional()
  @IsArray()
  userEmbedding?: number[];

  @ApiPropertyOptional({ default: 10 })
  @IsOptional()
  limit?: number;
}
