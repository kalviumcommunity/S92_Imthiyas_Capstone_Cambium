import { IsNotEmpty, IsOptional, IsString, IsArray, MaxLength } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  visibility?: string;

  @IsString()
  @IsOptional()
  targetGrantId?: string;

  @IsArray()
  @IsOptional()
  linkedDois?: string[];
}
