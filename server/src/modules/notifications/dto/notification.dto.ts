import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateNotificationDto {
  @ApiProperty({ description: 'Target user UUID' })
  @IsUUID()
  @IsNotEmpty()
  user: string;

  @ApiPropertyOptional({ description: 'Associated opportunity UUID' })
  @IsOptional()
  @IsUUID()
  opportunity?: string;

  @ApiPropertyOptional({ description: 'Associated workspace/project UUID' })
  @IsOptional()
  @IsUUID()
  projectId?: string;

  @ApiPropertyOptional({ description: 'Notification classification', example: 'WORKSPACE_INVITE' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  type?: string;

  @ApiPropertyOptional({ description: 'Short notification headline' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @ApiPropertyOptional({ description: 'Target deep-link path inside Cambium' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  link?: string;

  @ApiPropertyOptional({ description: 'Deduplication key to prevent duplicate notifications' })
  @IsOptional()
  @IsString()
  @MaxLength(160)
  dedupKey?: string;

  @ApiProperty({ description: 'Notification message text' })
  @IsString()
  @IsNotEmpty()
  message: string;
}
