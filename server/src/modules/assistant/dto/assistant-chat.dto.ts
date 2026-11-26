import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsIn,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class AssistantMessageDto {
  @IsIn(['user', 'assistant', 'system'])
  role!: 'user' | 'assistant' | 'system';

  @IsString()
  @MaxLength(8000)
  content!: string;
}

export class AssistantUserProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  institution?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  careerStage?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  primaryField?: string;
}

export class AssistantContextDto {
  @IsOptional()
  @IsString()
  @MaxLength(60)
  persona?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => AssistantUserProfileDto)
  userProfile?: AssistantUserProfileDto;

  @IsOptional()
  @IsUUID()
  opportunityId?: string;

  @IsOptional()
  @IsUUID()
  workspaceId?: string;

  @IsOptional()
  @IsUUID()
  conversationId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10000)
  documentSnippet?: string;
}

export class AssistantChatDto {
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(30)
  @ValidateNested({ each: true })
  @Type(() => AssistantMessageDto)
  messages!: AssistantMessageDto[];

  @IsOptional()
  @IsUUID()
  conversationId?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => AssistantContextDto)
  context?: AssistantContextDto;
}
