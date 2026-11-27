import {
  IsOptional,
  IsString,
  IsUUID,
  IsObject,
  Matches,
  MaxLength,
  IsIn,
} from 'class-validator';

export const CANONICAL_EVENT_NAME_REGEX = /^[a-z0-9_]+\.[a-z0-9_]+(\.[a-z0-9_]+)?$/;

export class RecordClientEventDto {
  @IsString()
  @MaxLength(80)
  @Matches(CANONICAL_EVENT_NAME_REGEX, {
    message: 'eventName must follow canonical <domain>.<entity>.<action> dot-notation',
  })
  eventName: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  idempotencyKey?: string;

  @IsOptional()
  @IsUUID()
  workspaceId?: string;

  @IsOptional()
  @IsIn(['SUCCESS', 'FAILURE'])
  outcome?: 'SUCCESS' | 'FAILURE';

  @IsOptional()
  @IsString()
  @MaxLength(16)
  schemaVersion?: string;

  @IsOptional()
  @IsObject()
  properties?: Record<string, unknown>;
}

export class RecordClientErrorDto {
  @IsString()
  @MaxLength(120)
  route: string;

  @IsString()
  @MaxLength(80)
  errorName: string;

  @IsOptional()
  @IsString()
  @MaxLength(64)
  errorDigest?: string;

  @IsString()
  @MaxLength(240)
  message: string;
}
