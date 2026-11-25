import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsArray,
  MaxLength,
  ArrayMaxSize,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: 'Full name of user', example: 'Jane Doe' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  fullName: string;

  @ApiProperty({ description: 'Unique user email address', example: 'janedoe@mit.edu' })
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(255)
  email: string;

  @ApiPropertyOptional({ description: 'Academic or research institution', example: 'MIT Media Lab' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  institution?: string;

  @ApiPropertyOptional({ type: [String], description: 'Research interests list', example: ['Machine Learning', 'Quantum Computing'] })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @IsString({ each: true })
  @MaxLength(100, { each: true })
  researchInterests?: string[];
}

export class UpdateUserDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  fullName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  institution?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @IsString({ each: true })
  @MaxLength(100, { each: true })
  researchInterests?: string[];
}

export class AddInterestsDto {
  @ApiProperty({ type: [String], description: 'Research interests to associate' })
  @IsArray()
  @ArrayMaxSize(20)
  @IsString({ each: true })
  @MaxLength(100, { each: true })
  interests: string[];
}
