import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GoogleLoginDto {
  @ApiProperty({ description: 'The Google JWT ID token received from the client' })
  @IsNotEmpty()
  @IsString()
  token: string;
}
