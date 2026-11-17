import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const SUBSCRIPTION_KEY = 'subscription_tier';
export const RequiresSubscription = (tier: string) =>
  Reflect.metadata(SUBSCRIPTION_KEY, tier);

@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredTier = this.reflector.get<string>(SUBSCRIPTION_KEY, context.getHandler());
    if (!requiredTier) return true;

    const tierOrder = ['free', 'pro', 'team', 'enterprise'];
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) return false;

    const userTier = (user as any).subscriptionTier || 'free';
    const hasAccess = tierOrder.indexOf(userTier) >= tierOrder.indexOf(requiredTier);

    if (!hasAccess) {
      throw new ForbiddenException(`This feature requires ${requiredTier} subscription`);
    }
    return true;
  }
}
