import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  IsString,
  IsArray,
  IsObject,
  MaxLength,
  ArrayMaxSize,
} from 'class-validator';
import { AcademicPostType } from '../entities/academic-post.entity';

export class UpdatePostDto {
  @ApiPropertyOptional({ enum: AcademicPostType })
  @IsOptional()
  @IsEnum(AcademicPostType)
  type?: AcademicPostType;

  @ApiPropertyOptional({ maxLength: 255 })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @IsString({ each: true })
  @MaxLength(60, { each: true })
  tags?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  doiReference?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  opportunityId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  collaborationMetadata?: {
    lookingFor?: string;
    preferredSkills?: string[];
    targetDeadline?: string;
    fundingAmount?: string;
  };
}
