import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateNotificationDto {
  @ApiProperty({ description: 'Target user UUID' })
  @IsUUID()
  @IsNotEmpty()
  user: string;

  @ApiPropertyOptional({ description: 'Associated opportunity UUID' })
  @IsOptional()
  @IsUUID()
  opportunity?: string;

  @ApiProperty({ description: 'Notification message text' })
  @IsString()
  @IsNotEmpty()
  message: string;
}
