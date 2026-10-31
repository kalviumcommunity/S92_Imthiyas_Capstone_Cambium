import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsArray,
  IsObject,
  MaxLength,
} from 'class-validator';
import { AcademicPostType } from '../entities/academic-post.entity';

export class CreatePostDto {
  @IsEnum(AcademicPostType)
  @IsNotEmpty()
  type: AcademicPostType;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsArray()
  @IsOptional()
  tags?: string[];

  @IsString()
  @IsOptional()
  doiReference?: string;

  @IsString()
  @IsOptional()
  opportunityId?: string;

  @IsObject()
  @IsOptional()
  collaborationMetadata?: {
    lookingFor?: string;
    preferredSkills?: string[];
    targetDeadline?: string;
    fundingAmount?: string;
  };
}
