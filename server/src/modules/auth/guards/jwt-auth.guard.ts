import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Optional,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { RedisService } from '../../../common/redis/redis.service';
import { extractAccessTokenFromHeaders, getJwtSecret } from '../jwt.config';

export interface AuthenticatedUser {
  id: string;
  email?: string;
  username?: string;
  role?: string;
  organizationId?: string | null;
  departmentId?: string | null;
  subscriptionTier?: string;
  jti?: string;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(@Optional() private readonly redisService?: RedisService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = extractAccessTokenFromHeaders(request.headers || {}, request.cookies);

    if (!token) {
      throw new UnauthorizedException('Authentication required: no valid access token provided');
    }

    const secret = getJwtSecret();

    try {
      const decoded = jwt.verify(token, secret, {
        algorithms: ['HS256'],
      }) as AuthenticatedUser & { type?: string };
      if (decoded.type && decoded.type !== 'access') {
        throw new UnauthorizedException('Invalid token type: access token required');
      }

      // Zero-Trust validation: check Redis jti blacklist
      if (decoded.jti && this.redisService) {
        const isRevoked = await this.redisService.isBlacklisted(decoded.jti);
        if (isRevoked) {
          throw new UnauthorizedException('Authentication token has been revoked');
        }
      }

      request.user = decoded;
      return true;
    } catch (err: any) {
      if (err instanceof UnauthorizedException) {
        throw err;
      }
      throw new UnauthorizedException('Invalid or expired authentication token');
    }
  }
}
