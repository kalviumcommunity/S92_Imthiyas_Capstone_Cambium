import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsArray } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: 'Full name of user', example: 'Jane Doe' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ description: 'Unique user email address', example: 'janedoe@mit.edu' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiPropertyOptional({ description: 'Academic or research institution', example: 'MIT Media Lab' })
  @IsOptional()
  @IsString()
  institution?: string;

  @ApiPropertyOptional({ type: [String], description: 'Research interests list', example: ['Machine Learning', 'Quantum Computing'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  researchInterests?: string[];
}

export class UpdateUserDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  institution?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  researchInterests?: string[];
}

export class AddInterestsDto {
  @ApiProperty({ type: [String], description: 'Research interests to associate' })
  @IsArray()
  @IsString({ each: true })
  interests: string[];
}
