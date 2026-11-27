import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ConsentAction, ConsentPurpose } from '../entities/consent-record.entity';
import { PrivacyRequestType } from '../entities/privacy-request.entity';

export class UpdatePrivacyPreferencesDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  profilePublic?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  showInstitution?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  showPublications?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  allowSearch?: boolean;

  @ApiPropertyOptional({ description: 'Explicit opt-in for external LLM assistant processing' })
  @IsOptional()
  @IsBoolean()
  aiProcessingConsent?: boolean;

  @ApiPropertyOptional({ description: 'Explicit opt-in for optional product analytics' })
  @IsOptional()
  @IsBoolean()
  optionalAnalyticsConsent?: boolean;

  @ApiPropertyOptional({ example: 'v2026-11' })
  @IsOptional()
  @IsString()
  @MaxLength(32)
  noticeVersion?: string;

  @ApiPropertyOptional({ example: 'settings_privacy' })
  @IsOptional()
  @IsString()
  @MaxLength(64)
  sourceInterface?: string;
}

export class RecordConsentDto {
  @ApiProperty({ enum: ConsentPurpose })
  @IsEnum(ConsentPurpose)
  purpose: ConsentPurpose;

  @ApiProperty({ enum: ConsentAction })
  @IsEnum(ConsentAction)
  action: ConsentAction;

  @ApiProperty({ example: 'v2026-11' })
  @IsString()
  @MinLength(2)
  @MaxLength(32)
  noticeVersion: string;

  @ApiPropertyOptional({ example: 'en' })
  @IsOptional()
  @IsString()
  @MaxLength(16)
  noticeLanguage?: string;

  @ApiPropertyOptional({ example: 'cookie_banner' })
  @IsOptional()
  @IsString()
  @MaxLength(64)
  sourceInterface?: string;
}

export class CreatePrivacyRequestDto {
  @ApiProperty({ enum: PrivacyRequestType })
  @IsEnum(PrivacyRequestType)
  requestType: PrivacyRequestType;

  @ApiPropertyOptional({ maxLength: 1000 })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  details?: string;
}

export class ExecuteErasureDto {
  @ApiProperty({ example: 'DELETE' })
  @IsString()
  @MinLength(6)
  @MaxLength(16)
  confirmationText: string;

  @ApiPropertyOptional({ maxLength: 500 })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;
}
