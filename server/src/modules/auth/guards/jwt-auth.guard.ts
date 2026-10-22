import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Optional,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { RedisService } from '../../../common/redis/redis.service';

export interface AuthenticatedUser {
  id: string;
  email?: string;
  username?: string;
  jti?: string;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(@Optional() private readonly redisService?: RedisService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Authentication required: no Bearer token provided');
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'cambium_jwt_secret_key_2026';

    try {
      const decoded = jwt.verify(token, secret) as AuthenticatedUser;

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
