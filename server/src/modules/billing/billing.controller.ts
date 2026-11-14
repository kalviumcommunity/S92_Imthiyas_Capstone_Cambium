import { Controller, Post, Get, Body, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('billing')
@UseGuards(JwtAuthGuard)
export class BillingController {
  @Post('subscribe')
  async subscribe(@Body() body: { tier: string; cycle: string }, @Req() req: any) {
    // Mock payment - no real Stripe yet (USE_MOCK_PAYMENTS=true)
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + (body.cycle === 'annual' ? 12 : 1));
    return {
      success: true,
      tier: body.tier,
      cycle: body.cycle,
      expiresAt: expiresAt.toISOString(),
      message: 'Subscription activated (mock mode)',
    };
  }

  @Get('invoices')
  async getInvoices(@Req() req: any) {
    return { invoices: [], total: 0 };
  }

  @Post('cancel')
  async cancelSubscription(@Req() req: any) {
    return { success: true, message: 'Subscription cancelled' };
  }
}
