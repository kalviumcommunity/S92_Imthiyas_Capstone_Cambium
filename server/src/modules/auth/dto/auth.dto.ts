import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
  IsArray,
  Matches,
  ArrayMaxSize,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'researcher42' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  @Matches(/^[a-zA-Z0-9._-]+$/, {
    message: 'Username may contain only letters, numbers, dots, underscores, and hyphens',
  })
  username: string;

  @ApiProperty({ example: 'Dr. Jane Smith' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  fullName: string;

  @ApiProperty({ example: 'janesmith@mit.edu' })
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(255)
  email: string;

  @ApiProperty({ example: 'StrongPass123!', minLength: 8, maxLength: 128 })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password: string;

  @ApiPropertyOptional({ example: 'MIT Media Lab' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  institution?: string;

  @ApiPropertyOptional({ type: [String], example: ['Deep Learning', 'Quantum Computing'] })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @IsString({ each: true })
  @MaxLength(100, { each: true })
  researchInterests?: string[];
}

export class LoginDto {
  @ApiPropertyOptional({ example: 'researcher42' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  username?: string;

  @ApiPropertyOptional({ example: 'janesmith@mit.edu' })
  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email?: string;

  @ApiProperty({ example: 'StrongPass123!' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(128)
  password: string;
}
