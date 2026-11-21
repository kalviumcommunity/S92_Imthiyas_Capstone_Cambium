import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GoogleLoginDto {
  @ApiProperty({ description: 'The Google JWT ID token or OAuth access token', required: false })
  @IsOptional()
  @IsString()
  token?: string;

  @ApiProperty({ description: 'The Google OAuth2 access token', required: false })
  @IsOptional()
  @IsString()
  access_token?: string;

  @ApiProperty({ description: 'Verified Google user email', required: false })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ description: 'Verified Google user full name', required: false })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiProperty({ description: 'Verified Google user display name alias', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Google avatar picture URL', required: false })
  @IsOptional()
  @IsString()
  picture?: string;

  @ApiProperty({ description: 'Google subject user ID', required: false })
  @IsOptional()
  @IsString()
  googleId?: string;
}
