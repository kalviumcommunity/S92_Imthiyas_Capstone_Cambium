import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateBookmarkDto {
  @ApiProperty({ description: 'User UUID', example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', required: false })
  @IsUUID()
  @IsOptional()
  user?: string;

  @ApiProperty({ description: 'Research Opportunity UUID', example: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22' })
  @IsUUID()
  @IsNotEmpty()
  opportunity: string;
}
