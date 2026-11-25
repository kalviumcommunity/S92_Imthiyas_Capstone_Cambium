import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsIn, IsOptional, IsString, MaxLength } from 'class-validator';
import { SubscriptionTier } from '../entities/subscription.entity';

export class SubscribeDto {
  @ApiProperty({ enum: SubscriptionTier, example: SubscriptionTier.PRO })
  @IsEnum(SubscriptionTier)
  tier: SubscriptionTier;

  @ApiProperty({ enum: ['monthly', 'annual'], example: 'monthly' })
  @IsIn(['monthly', 'annual'])
  cycle: 'monthly' | 'annual';

  @ApiPropertyOptional({ example: 'pm_card_visa' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  paymentMethodId?: string;
}
