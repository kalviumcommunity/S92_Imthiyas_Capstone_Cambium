import { IsOptional, IsString, IsArray, MaxLength, IsInt } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProjectDto {
  @ApiPropertyOptional({ example: 'DARPA QuBiT: Quantum Coherence Scaling Protocol' })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  title?: string;

  @ApiPropertyOptional({ example: 'Refined proposal abstract with 100-qubit benchmark figures.' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 'LAB_ONLY', enum: ['PUBLIC', 'LAB_ONLY', 'PRIVATE'] })
  @IsString()
  @IsOptional()
  visibility?: string;

  @ApiPropertyOptional({ example: 'ACTIVE', enum: ['ACTIVE', 'UNDER_REVIEW', 'SUBMITTED', 'ARCHIVED'] })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({ example: '8a91b2c3-4d5e-6f7a-8b9c-0d1e2f3a4b5c' })
  @IsString()
  @IsOptional()
  targetGrantId?: string;

  @ApiPropertyOptional({ example: ['10.1038/s41586-024-07142-3'] })
  @IsArray()
  @IsOptional()
  linkedDois?: string[];

  @ApiPropertyOptional({
    description: 'Optimistic concurrency control token. If provided, server asserts match before persisting mutation.',
    example: 3,
  })
  @IsInt()
  @IsOptional()
  version?: number;
}
