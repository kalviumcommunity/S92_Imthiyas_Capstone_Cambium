import { Controller, Post, Get, Body, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BillingService } from './billing.service';
import { SubscriptionTier } from './entities/subscription.entity';

@Controller('billing')
@UseGuards(JwtAuthGuard)
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Post('subscribe')
  async subscribe(
    @Body() body: { tier: SubscriptionTier; cycle: 'monthly' | 'annual'; paymentMethodId?: string },
    @Req() req: any,
  ) {
    const userId = req.user?.id || req.user?.userId;
    return this.billingService.createOrUpdateSubscription(userId, {
      tier: body.tier || SubscriptionTier.PRO,
      cycle: body.cycle || 'monthly',
      paymentMethodId: body.paymentMethodId,
    });
  }

  @Get('invoices')
  async getInvoices(@Req() req: any) {
    const userId = req.user?.id || req.user?.userId;
    return this.billingService.getInvoices(userId);
  }

  @Get('subscription')
  async getSubscription(@Req() req: any) {
    const userId = req.user?.id || req.user?.userId;
    return this.billingService.getSubscription(userId);
  }

  @Post('cancel')
  async cancelSubscription(@Req() req: any) {
    const userId = req.user?.id || req.user?.userId;
    return this.billingService.cancelSubscription(userId);
  }
}
