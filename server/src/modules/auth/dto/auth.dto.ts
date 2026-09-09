import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength, IsArray } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'researcher42' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'Dr. Jane Smith' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ example: 'janesmith@mit.edu' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'password123', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({ example: 'MIT Media Lab' })
  @IsOptional()
  @IsString()
  institution?: string;

  @ApiPropertyOptional({ type: [String], example: ['Deep Learning', 'Quantum Computing'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  researchInterests?: string[];
}

export class LoginDto {
  @ApiPropertyOptional({ example: 'researcher42' })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiPropertyOptional({ example: 'janesmith@mit.edu' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
