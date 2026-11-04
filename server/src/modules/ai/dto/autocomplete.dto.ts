import { IsString, IsNotEmpty, IsOptional, IsIn, IsInt, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AutocompleteDto {
  @ApiProperty({
    description: 'The prefix string typed by the user to autocomplete',
    example: 'quantum error',
  })
  @IsString()
  @IsNotEmpty()
  prefix: string;

  @ApiPropertyOptional({
    description: 'Surrounding context, abstract excerpt, or prior paragraph text',
    example: 'In this paper we investigate fault-tolerant quantum computation architectures.',
  })
  @IsOptional()
  @IsString()
  context?: string;

  @ApiPropertyOptional({
    description: 'Autocomplete operational mode: search (query completion), copilot (manuscript sentence continuation), or keywords (scientific taxonomies)',
    enum: ['search', 'copilot', 'keywords'],
    default: 'search',
  })
  @IsOptional()
  @IsIn(['search', 'copilot', 'keywords'])
  mode?: 'search' | 'copilot' | 'keywords' = 'search';

  @ApiPropertyOptional({
    description: 'Maximum number of suggestion items to return',
    minimum: 1,
    maximum: 10,
    default: 5,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  limit?: number = 5;
}
