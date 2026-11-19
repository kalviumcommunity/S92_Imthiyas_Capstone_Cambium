import { IsNotEmpty, IsString, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({
    description: 'Markdown-formatted comment or critique on proposal text',
    example: 'Please verify if the qubit coherence time assumptions align with recent Physical Review Letters benchmarks.',
  })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiPropertyOptional({
    description: 'Specific section anchor or draft block identifier',
    example: 'methodology_section_3',
  })
  @IsOptional()
  @IsString()
  sectionId?: string;

  @ApiPropertyOptional({
    description: 'Parent comment UUID for threaded reply hierarchy',
    example: 'b7c3e590-71a2-4d2a-892a-0a7146522c19',
  })
  @IsOptional()
  @IsUUID()
  parentId?: string;
}
