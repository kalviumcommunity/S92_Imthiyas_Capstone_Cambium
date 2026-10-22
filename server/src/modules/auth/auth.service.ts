import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import { User } from '../users/entities/user.entity';
import { ResearchInterest } from '../users/entities/research-interest.entity';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { RedisService } from '../../common/redis/redis.service';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  accessJti: string;
  refreshJti: string;
}

export interface JwtTokenPayload {
  id: string;
  email?: string;
  username?: string;
  jti: string;
  type: 'access' | 'refresh';
  iat?: number;
  exp?: number;
}

@Injectable()
export class AuthService {
  private readonly jwtSecret = process.env.JWT_SECRET || 'cambium_jwt_secret_key_2026';
  private readonly jwtRefreshSecret =
    process.env.JWT_REFRESH_SECRET || 'cambium_jwt_refresh_secret_key_2026_super_secure';
  private readonly googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || 'dummy-client-id');

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(ResearchInterest)
    private readonly interestRepo: Repository<ResearchInterest>,
    private readonly redisService: RedisService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.userRepo
      .createQueryBuilder('user')
      .where('LOWER(user.username) = LOWER(:username)', { username: dto.username })
      .orWhere('LOWER(user.email) = LOWER(:email)', { email: dto.email })
      .getOne();

    if (existing) {
      if (existing.username.toLowerCase() === dto.username.toLowerCase()) {
        throw new BadRequestException('Username is already taken');
      }
      throw new BadRequestException('User with this email already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(dto.password, salt);

    const interests = await this.resolveInterests(dto.researchInterests);

    const user = this.userRepo.create({
      username: dto.username.toLowerCase(),
      fullName: dto.fullName,
      email: dto.email.toLowerCase(),
      passwordHash,
      institution: dto.institution,
      researchInterests: interests,
    });

    const saved = await this.userRepo.save(user);
    const tokens = this.generateTokenPair(saved.id, saved.email, saved.username);

    return {
      success: true,
      message: 'User registered successfully!',
      token: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: saved.id,
        username: saved.username,
        fullName: saved.fullName,
        email: saved.email,
        institution: saved.institution,
        researchInterests: saved.researchInterests.map((i) => i.name),
        createdAt: saved.createdAt,
      },
    };
  }

  async login(dto: LoginDto) {
    const identifier = (dto.username || dto.email)?.toLowerCase();
    if (!identifier) {
      throw new BadRequestException('Please provide username or email');
    }

    const user = await this.userRepo
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .leftJoinAndSelect('user.researchInterests', 'interest')
      .where('LOWER(user.username) = :id', { id: identifier })
      .orWhere('LOWER(user.email) = :id', { id: identifier })
      .getOne();

    if (!user) {
      throw new UnauthorizedException('Invalid credentials: User not found');
    }

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials: Password incorrect');
    }

    const tokens = this.generateTokenPair(user.id, user.email, user.username);

    return {
      success: true,
      message: 'Login successful!',
      token: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        institution: user.institution,
        researchInterests: user.researchInterests ? user.researchInterests.map((i) => i.name) : [],
      },
    };
  }

  async googleLogin(token: string) {
    let ticket;
    try {
      ticket = await this.googleClient.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID || 'dummy-client-id',
      });
    } catch (error) {
      if (!process.env.GOOGLE_CLIENT_ID || process.env.NODE_ENV !== 'production') {
        const decoded = jwt.decode(token) as any;
        if (!decoded || !decoded.email) throw new UnauthorizedException('Invalid Google token');
        ticket = { getPayload: () => decoded };
      } else {
        throw new UnauthorizedException('Invalid Google token');
      }
    }

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      throw new UnauthorizedException('Invalid Google token payload');
    }

    const email = payload.email.toLowerCase();

    let user = await this.userRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.researchInterests', 'interest')
      .where('LOWER(user.email) = :email', { email })
      .getOne();

    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(Math.random().toString(36).slice(-10) + 'A1!', salt);

      let username = payload.name ? payload.name.replace(/\s+/g, '').toLowerCase() : email.split('@')[0];
      let uniqueUsername = username;
      let count = 1;
      while (await this.userRepo.findOne({ where: { username: uniqueUsername } })) {
        uniqueUsername = `${username}${count}`;
        count++;
      }

      const newUser = this.userRepo.create({
        username: uniqueUsername,
        email,
        fullName: payload.name || 'Google User',
        passwordHash,
        institution: 'Unknown Institution',
        researchInterests: [],
      });

      user = await this.userRepo.save(newUser);
    }

    const tokens = this.generateTokenPair(user.id, user.email, user.username);

    return {
      success: true,
      message: 'Google login successful!',
      token: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        institution: user.institution,
        researchInterests: user.researchInterests ? user.researchInterests.map((i) => i.name) : [],
      },
    };
  }

  /**
   * Refreshes access and refresh token pair using rotating token protocol
   * Invalidates previously used refresh token jti in Redis to prevent replay attacks
   */
  async refreshSession(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }

    let decoded: JwtTokenPayload;
    try {
      decoded = jwt.verify(refreshToken, this.jwtRefreshSecret) as JwtTokenPayload;
    } catch (err: any) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    if (decoded.type !== 'refresh' || !decoded.jti) {
      throw new UnauthorizedException('Invalid token type for refresh session');
    }

    // Check Redis revocation blacklist
    const isRevoked = await this.redisService.isBlacklisted(decoded.jti);
    if (isRevoked) {
      throw new UnauthorizedException('Refresh token has been revoked or invalidated');
    }

    // Invalidate old refresh token jti immediately (Zero-Trust Rotation)
    const nowSec = Math.floor(Date.now() / 1000);
    const remainingTtl = decoded.exp ? Math.max(decoded.exp - nowSec, 60) : 7 * 24 * 3600;
    await this.redisService.blacklistJti(decoded.jti, remainingTtl);

    // Fetch user to confirm account active
    const user = await this.userRepo.findOne({
      where: { id: decoded.id },
      relations: { researchInterests: true },
    });

    if (!user) {
      throw new UnauthorizedException('User associated with session not found');
    }

    // Issue brand new token pair
    const newTokens = this.generateTokenPair(user.id, user.email, user.username);

    return {
      success: true,
      message: 'Session refreshed successfully with rotating token pair',
      token: newTokens.accessToken,
      refreshToken: newTokens.refreshToken,
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        institution: user.institution,
        researchInterests: user.researchInterests ? user.researchInterests.map((i) => i.name) : [],
      },
    };
  }

  /**
   * Logs out user by revoking tokens in Redis blacklist
   */
  async logout(refreshToken?: string, accessToken?: string) {
    if (refreshToken) {
      try {
        const decoded = jwt.decode(refreshToken) as JwtTokenPayload;
        if (decoded?.jti && decoded.exp) {
          const nowSec = Math.floor(Date.now() / 1000);
          const remainingTtl = Math.max(decoded.exp - nowSec, 60);
          await this.redisService.blacklistJti(decoded.jti, remainingTtl);
        }
      } catch (err) {
        // Silently continue
      }
    }

    if (accessToken) {
      try {
        const decoded = jwt.decode(accessToken) as JwtTokenPayload;
        if (decoded?.jti && decoded.exp) {
          const nowSec = Math.floor(Date.now() / 1000);
          const remainingTtl = Math.max(decoded.exp - nowSec, 60);
          await this.redisService.blacklistJti(decoded.jti, remainingTtl);
        }
      } catch (err) {
        // Silently continue
      }
    }

    return {
      success: true,
      message: 'Logged out successfully, security credentials invalidated',
    };
  }

  async getMe(userId: string) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: { researchInterests: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      success: true,
      message: 'User authorization verified via Bearer JWT',
      user,
    };
  }

  /**
   * Generates a single legacy token (15m expiry)
   */
  generateToken(userId: string): string {
    return this.generateTokenPair(userId).accessToken;
  }

  /**
   * Generates short-lived access token (15m) and long-lived refresh token (7d)
   */
  generateTokenPair(userId: string, email?: string, username?: string): TokenPair {
    const accessJti = randomUUID();
    const refreshJti = randomUUID();

    const accessToken = jwt.sign(
      {
        id: userId,
        email,
        username,
        jti: accessJti,
        type: 'access',
      },
      this.jwtSecret,
      { expiresIn: '15m' },
    );

    const refreshToken = jwt.sign(
      {
        id: userId,
        email,
        username,
        jti: refreshJti,
        type: 'refresh',
      },
      this.jwtRefreshSecret,
      { expiresIn: '7d' },
    );

    return {
      accessToken,
      refreshToken,
      accessJti,
      refreshJti,
    };
  }

  private async resolveInterests(rawList?: string[]): Promise<ResearchInterest[]> {
    if (!rawList || !Array.isArray(rawList) || rawList.length === 0) {
      return [];
    }

    const resolved: ResearchInterest[] = [];
    for (const item of rawList) {
      const trimmed = item.trim();
      if (!trimmed) continue;
      const slug = trimmed.toLowerCase().replace(/[^a-z0-9]+/g, '-');

      let interest = await this.interestRepo.findOne({ where: { slug } });
      if (!interest) {
        interest = this.interestRepo.create({ name: trimmed, slug });
        interest = await this.interestRepo.save(interest);
      }
      resolved.push(interest);
    }
    return resolved;
  }
}
