import { Controller, Post, Get, Body, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BillingService } from './billing.service';
import { SubscribeDto } from './dto/subscribe.dto';

@ApiTags('Billing & Subscriptions')
@ApiBearerAuth()
@Controller(['billing', 'api/billing', 'api/v1/billing'])
@UseGuards(JwtAuthGuard)
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Post('subscribe')
  @ApiOperation({ summary: 'Create or upgrade scholar subscription inside atomic transaction' })
  async subscribe(@Body() dto: SubscribeDto, @Req() req: any) {
    const userId = req.user?.id || req.user?.userId;
    return this.billingService.createOrUpdateSubscription(userId, dto);
  }

  @Get('invoices')
  @ApiOperation({ summary: 'List paginated invoices for authenticated user' })
  async getInvoices(
    @Req() req: any,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const userId = req.user?.id || req.user?.userId;
    return this.billingService.getInvoices(
      userId,
      limit ? Number(limit) : 50,
      offset ? Number(offset) : 0,
    );
  }

  @Get('subscription')
  @ApiOperation({ summary: 'Get active subscription status for authenticated user' })
  async getSubscription(@Req() req: any) {
    const userId = req.user?.id || req.user?.userId;
    return this.billingService.getSubscription(userId);
  }

  @Post('cancel')
  @ApiOperation({ summary: 'Schedule cancellation of active subscription' })
  async cancelSubscription(@Req() req: any) {
    const userId = req.user?.id || req.user?.userId;
    return this.billingService.cancelSubscription(userId);
  }
}
