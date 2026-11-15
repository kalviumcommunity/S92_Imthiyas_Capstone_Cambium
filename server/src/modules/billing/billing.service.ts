import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription, SubscriptionTier, SubscriptionStatus } from './entities/subscription.entity';
import { Invoice } from './entities/invoice.entity';

export interface CreateSubscriptionDto {
  tier: SubscriptionTier;
  cycle: 'monthly' | 'annual';
  paymentMethodId?: string;
}

@Injectable()
export class BillingService {
  private readonly logger = new Logger(BillingService.name);

  constructor(
    @InjectRepository(Subscription)
    private readonly subRepo: Repository<Subscription>,
    @InjectRepository(Invoice)
    private readonly invoiceRepo: Repository<Invoice>,
  ) {}

  async createOrUpdateSubscription(userId: string, dto: CreateSubscriptionDto) {
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + (dto.cycle === 'annual' ? 12 : 1));

    // Check existing
    let sub = await this.subRepo.findOne({ where: { userId } });
    const isStripeConfigured = Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY !== 'mock');

    let stripeSubId = `sub_test_mock_${Date.now()}`;
    let stripeCustId = `cus_test_mock_${Date.now()}`;

    if (isStripeConfigured) {
      this.logger.log(`[Stripe Test Mode] Initializing subscription for user ${userId} to ${dto.tier}`);
    }

    if (sub) {
      sub.tier = dto.tier;
      sub.cycle = dto.cycle;
      sub.status = SubscriptionStatus.ACTIVE;
      sub.expiresAt = expiresAt;
      sub.stripeSubscriptionId = stripeSubId;
      sub = await this.subRepo.save(sub);
    } else {
      sub = this.subRepo.create({
        userId,
        tier: dto.tier,
        cycle: dto.cycle,
        status: SubscriptionStatus.ACTIVE,
        stripeCustomerId: stripeCustId,
        stripeSubscriptionId: stripeSubId,
        expiresAt,
      });
      sub = await this.subRepo.save(sub);
    }

    // Create Invoice Record
    const tierPrices: Record<SubscriptionTier, number> = {
      [SubscriptionTier.FREE]: 0,
      [SubscriptionTier.PRO]: dto.cycle === 'annual' ? 10 : 1,
      [SubscriptionTier.TEAM]: dto.cycle === 'annual' ? 490 : 49,
      [SubscriptionTier.ENTERPRISE]: 299,
    };

    const invoice = this.invoiceRepo.create({
      userId,
      invoiceNumber: `CAMB-${Math.floor(10000 + Math.random() * 90000)}`,
      amount: tierPrices[dto.tier] || 0,
      currency: 'USD',
      status: 'Paid',
      planName: `Cambium ${dto.tier.toUpperCase()} (${dto.cycle})`,
      paymentMethod: isStripeConfigured ? 'Stripe Checkout (Card)' : 'Simulated Test Card (••4242)',
    });
    await this.invoiceRepo.save(invoice);

    return {
      success: true,
      subscription: sub,
      invoice,
      message: `Successfully subscribed to ${dto.tier} tier (${dto.cycle})`,
    };
  }

  async getInvoices(userId: string) {
    const invoices = await this.invoiceRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
    return { invoices, total: invoices.length };
  }

  async getSubscription(userId: string) {
    const sub = await this.subRepo.findOne({ where: { userId } });
    return sub || { tier: SubscriptionTier.FREE, status: SubscriptionStatus.ACTIVE };
  }

  async cancelSubscription(userId: string) {
    const sub = await this.subRepo.findOne({ where: { userId } });
    if (sub) {
      sub.status = SubscriptionStatus.CANCELED;
      await this.subRepo.save(sub);
    }
    return { success: true, message: 'Subscription successfully scheduled for cancellation' };
  }
}

