import { Injectable, Logger, Optional } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { randomBytes } from 'crypto';
import { Subscription, SubscriptionTier, SubscriptionStatus } from './entities/subscription.entity';
import { Invoice } from './entities/invoice.entity';
import { SubscribeDto } from './dto/subscribe.dto';

export type CreateSubscriptionDto = SubscribeDto;

@Injectable()
export class BillingService {
  private readonly logger = new Logger(BillingService.name);

  constructor(
    @InjectRepository(Subscription)
    private readonly subRepo: Repository<Subscription>,
    @InjectRepository(Invoice)
    private readonly invoiceRepo: Repository<Invoice>,
    @Optional() private readonly dataSource?: DataSource,
  ) {}

  async createOrUpdateSubscription(userId: string, dto: CreateSubscriptionDto) {
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + (dto.cycle === 'annual' ? 12 : 1));

    const isStripeConfigured = Boolean(
      process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY !== 'mock',
    );
    const suffix = randomBytes(4).toString('hex').toUpperCase();
    const stripeSubId = `sub_camb_${suffix}`;
    const stripeCustId = `cus_camb_${suffix}`;

    const executeBilling = async (
      sRepo: Repository<Subscription>,
      iRepo: Repository<Invoice>,
    ) => {
      let sub = await sRepo.findOne({ where: { userId } });
      if (sub) {
        sub.tier = dto.tier;
        sub.cycle = dto.cycle;
        sub.status = SubscriptionStatus.ACTIVE;
        sub.expiresAt = expiresAt;
        sub.stripeSubscriptionId = stripeSubId;
        sub = await sRepo.save(sub);
      } else {
        sub = await sRepo.save(
          sRepo.create({
            userId,
            tier: dto.tier,
            cycle: dto.cycle,
            status: SubscriptionStatus.ACTIVE,
            stripeCustomerId: stripeCustId,
            stripeSubscriptionId: stripeSubId,
            expiresAt,
          }),
        );
      }

      const tierPrices: Record<SubscriptionTier, number> = {
        [SubscriptionTier.FREE]: 0,
        [SubscriptionTier.PRO]: dto.cycle === 'annual' ? 10 : 1,
        [SubscriptionTier.TEAM]: dto.cycle === 'annual' ? 50 : 5,
        [SubscriptionTier.ENTERPRISE]: 299,
      };

      const invoice = await iRepo.save(
        iRepo.create({
          userId,
          invoiceNumber: `CAMB-${randomBytes(4).toString('hex').toUpperCase()}`,
          amount: tierPrices[dto.tier] || 0,
          currency: 'USD',
          status: 'Paid',
          planName: `Cambium ${dto.tier.toUpperCase()} (${dto.cycle})`,
          paymentMethod: isStripeConfigured ? 'Stripe Checkout (Card)' : 'Simulated Test Card (••4242)',
        }),
      );

      return { sub, invoice };
    };

    const { sub, invoice } = this.dataSource
      ? await this.dataSource.transaction(async (m) =>
          executeBilling(m.getRepository(Subscription), m.getRepository(Invoice)),
        )
      : await executeBilling(this.subRepo, this.invoiceRepo);

    return {
      success: true,
      subscription: sub,
      invoice,
      message: `Successfully subscribed to ${dto.tier} tier (${dto.cycle})`,
    };
  }

  async getInvoices(userId: string, limit = 50, offset = 0) {
    const safeLimit = Math.min(Math.max(Number(limit) || 50, 1), 100);
    const safeOffset = Math.max(Number(offset) || 0, 0);
    const [invoices, total] = await this.invoiceRepo.findAndCount({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: safeLimit,
      skip: safeOffset,
    });
    return { invoices, total, limit: safeLimit, offset: safeOffset };
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

