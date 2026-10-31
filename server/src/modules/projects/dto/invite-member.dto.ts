import { IsNotEmpty, IsOptional, IsString, IsEnum } from 'class-validator';
import { CRediTRole } from '../entities/project-member.entity';

export class InviteMemberDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsEnum(CRediTRole)
  @IsOptional()
  creditRole?: CRediTRole;
}
