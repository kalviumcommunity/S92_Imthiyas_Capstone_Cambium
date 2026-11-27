import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
  Optional,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { randomUUID, randomBytes } from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import { User, UserRole } from '../users/entities/user.entity';
import { ResearchInterest } from '../users/entities/research-interest.entity';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { GoogleLoginDto } from './dto/google-login.dto';
import { RedisService } from '../../common/redis/redis.service';
import { getJwtSecret, getJwtRefreshSecret } from './jwt.config';
import { ProductAnalyticsService } from '../analytics/product-analytics.service';

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
  role?: string;
  organizationId?: string | null;
  departmentId?: string | null;
  jti: string;
  type: 'access' | 'refresh';
  iat?: number;
  exp?: number;
}

@Injectable()
export class AuthService {
  private readonly jwtSecret = getJwtSecret();
  private readonly jwtRefreshSecret = getJwtRefreshSecret();
  private readonly googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || 'dummy-client-id');

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(ResearchInterest)
    private readonly interestRepo: Repository<ResearchInterest>,
    private readonly redisService: RedisService,
    @Optional()
    private readonly productAnalytics?: ProductAnalyticsService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.userRepo
      .createQueryBuilder('user')
      .where('LOWER(user.username) = LOWER(:username)', { username: dto.username })
      .orWhere('LOWER(user.email) = LOWER(:email)', { email: dto.email })
      .getOne();

    if (existing) {
      throw new BadRequestException(
        'Registration unavailable with the provided account details',
      );
    }

    const salt = await bcrypt.genSalt(12);
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
    const tokens = this.generateTokenPair(
      saved.id,
      saved.email,
      saved.username,
      saved.role,
      saved.organizationId,
      saved.departmentId,
    );

    void this.productAnalytics?.recordBackendEvent({
      eventName: 'user.signup.completed',
      actorId: saved.id,
      actorEmail: saved.email,
      organizationId: saved.organizationId || null,
      idempotencyKey: `signup:${saved.id}`,
      properties: { role: saved.role },
    });

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
        role: saved.role,
        institution: saved.institution,
        organizationId: saved.organizationId || null,
        departmentId: saved.departmentId || null,
        researchInterests: saved.researchInterests.map((i) => i.name),
        createdAt: saved.createdAt,
      },
    };
  }

  async login(dto: LoginDto) {
    const identifier = (dto.username || dto.email)?.trim().toLowerCase();
    if (!identifier) {
      throw new BadRequestException('Please provide username or email');
    }

    // Account Lockout Security Check: 5 attempts locks for 15 minutes (900s)
    let lockoutCheck = { locked: false, remaining: 5 };
    try {
      lockoutCheck = await this.redisService.recordFailedLogin(identifier, 5, 900);
      if (lockoutCheck.locked) {
        throw new UnauthorizedException('Account temporarily locked due to 5 consecutive failed login attempts. Please try again in 15 minutes.');
      }
    } catch (lockoutErr) {
      if (lockoutErr instanceof UnauthorizedException) throw lockoutErr;
      // Resilient fallback if Redis has transient issues
    }

    let user: User | null = null;
    try {
      // Direct lookup with relations
      user = await this.userRepo.findOne({
        where: [
          { username: identifier },
          { email: identifier },
        ],
        relations: { researchInterests: true },
      });

      // Case-insensitive fallback if direct match not found
      if (!user) {
        user = await this.userRepo
          .createQueryBuilder('u')
          .leftJoinAndSelect('u.researchInterests', 'interest')
          .where('LOWER(u.username) = :identifier', { identifier })
          .orWhere('LOWER(u.email) = :identifier', { identifier })
          .getOne();
      }
    } catch {
      // Resilient fallback without joining relational tables
      user = await this.userRepo.findOne({
        where: [
          { username: identifier },
          { email: identifier },
        ],
      });
    }

    if (!user || !user.passwordHash) {
      void this.productAnalytics?.recordBackendEvent({
        eventName: 'user.login.failed',
        actorEmail: identifier,
        outcome: 'FAILURE',
        properties: { reason: 'user_not_found' },
      });
      throw new UnauthorizedException(`Invalid credentials. ${lockoutCheck.remaining} attempts remaining.`);
    }

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) {
      void this.productAnalytics?.recordBackendEvent({
        eventName: 'user.login.failed',
        actorId: user.id,
        actorEmail: user.email,
        organizationId: user.organizationId || null,
        outcome: 'FAILURE',
        properties: { reason: 'invalid_password' },
      });
      throw new UnauthorizedException(`Invalid credentials. ${lockoutCheck.remaining} attempts remaining.`);
    }

    // Reset failed login attempts on valid authentication
    try {
      await this.redisService.resetFailedLogins(identifier);
    } catch {
      // Non-blocking
    }

    const tokens = this.generateTokenPair(
      user.id,
      user.email,
      user.username,
      user.role,
      user.organizationId,
      user.departmentId,
    );

    void this.productAnalytics?.recordBackendEvent({
      eventName: 'user.login.completed',
      actorId: user.id,
      actorEmail: user.email,
      organizationId: user.organizationId || null,
      properties: { method: 'password', role: user.role },
    });

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
        role: user.role,
        institution: user.institution,
        organizationId: user.organizationId || null,
        departmentId: user.departmentId || null,
        researchInterests: user.researchInterests ? user.researchInterests.map((i) => i.name) : [],
      },
    };
  }

  async googleLogin(dtoOrToken: string | GoogleLoginDto) {
    let email: string = '';
    let fullName: string = '';
    let photoUrl: string | undefined = undefined;

    const token =
      typeof dtoOrToken === 'string'
        ? dtoOrToken
        : dtoOrToken.token || dtoOrToken.access_token || '';

    // 1. OAuth2 Bearer Access Token verified via authoritative Google userinfo endpoint
    if (token && token.split('.').length !== 3) {
      try {
        const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (userInfoRes.ok) {
          const gData = await userInfoRes.json();
          if (gData?.email && gData?.email_verified !== false) {
            email = String(gData.email).toLowerCase();
            fullName = gData.name || gData.given_name || '';
            photoUrl = gData.picture;
          }
        }
      } catch {
        // Fall through cleanly to rejection
      }
    }

    // 2. Cryptographically verified OIDC ID Token via Google OAuth2Client (no unsigned decode fallback)
    if (!email && token && token.split('.').length === 3 && process.env.GOOGLE_CLIENT_ID) {
      try {
        const ticket = await this.googleClient.verifyIdToken({
          idToken: token,
          audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (payload?.email && payload?.email_verified) {
          email = payload.email.toLowerCase();
          fullName = payload.name || '';
          photoUrl = payload.picture;
        }
      } catch {
        // Invalid/forged ID token rejected below
      }
    }

    if (!email) {
      throw new UnauthorizedException('Invalid or unverified Google identity token');
    }

    if (!fullName) {
      fullName = email.split('@')[0];
    }

    let user: User | null = null;
    try {
      user = await this.userRepo
        .createQueryBuilder('u')
        .leftJoinAndSelect('u.researchInterests', 'interest')
        .where('LOWER(u.email) = :email', { email })
        .getOne();
    } catch {
      user = await this.userRepo
        .createQueryBuilder('u')
        .where('LOWER(u.email) = :email', { email })
        .getOne();
    }

    if (!user) {
      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash(randomBytes(32).toString('hex'), salt);

      let username = fullName.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || email.split('@')[0];
      let uniqueUsername = username;
      let count = 1;
      while (await this.userRepo.findOne({ where: { username: uniqueUsername } })) {
        uniqueUsername = `${username}${count}`;
        count++;
      }

      try {
        const newUser = this.userRepo.create({
          username: uniqueUsername,
          email,
          fullName,
          passwordHash,
          institution: 'Independent Scholar',
          role: UserRole.RESEARCHER,
          researchInterests: [],
        });
        user = await this.userRepo.save(newUser);
      } catch {
        const newUser = this.userRepo.create({
          username: uniqueUsername,
          email,
          fullName,
          passwordHash,
          institution: 'Independent Scholar',
          role: UserRole.RESEARCHER,
        });
        user = await this.userRepo.save(newUser);
      }
    } else if (fullName && (user.fullName === 'Google User' || user.fullName === 'Verified Scholar' || !user.fullName)) {
      user.fullName = fullName;
      await this.userRepo.save(user);
    }

    const effectiveRole = user.role || UserRole.RESEARCHER;
    const tokens = this.generateTokenPair(
      user.id,
      user.email,
      user.username,
      effectiveRole,
      user.organizationId,
      user.departmentId,
    );

    return {
      success: true,
      message: 'Google login successful!',
      token: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        name: user.fullName,
        email: user.email,
        role: effectiveRole,
        institution: user.institution,
        organizationId: user.organizationId || null,
        departmentId: user.departmentId || null,
        photo: photoUrl || undefined,
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
      decoded = jwt.verify(refreshToken, this.jwtRefreshSecret, {
        algorithms: ['HS256'],
      }) as JwtTokenPayload;
    } catch {
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
    const newTokens = this.generateTokenPair(
      user.id,
      user.email,
      user.username,
      user.role,
      user.organizationId,
      user.departmentId,
    );

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
        role: user.role,
        institution: user.institution,
        organizationId: user.organizationId || null,
        departmentId: user.departmentId || null,
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
    let user: User | null = null;
    try {
      user = await this.userRepo.findOne({
        where: { id: userId },
        relations: { researchInterests: true },
      });
    } catch {
      user = await this.userRepo.findOne({
        where: { id: userId },
      });
    }

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
  generateTokenPair(
    userId: string,
    email?: string,
    username?: string,
    role?: string,
    organizationId?: string | null,
    departmentId?: string | null,
  ): TokenPair {
    const accessJti = randomUUID();
    const refreshJti = randomUUID();

    const accessToken = jwt.sign(
      {
        id: userId,
        email,
        username,
        role,
        organizationId: organizationId || null,
        departmentId: departmentId || null,
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
        role,
        organizationId: organizationId || null,
        departmentId: departmentId || null,
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
