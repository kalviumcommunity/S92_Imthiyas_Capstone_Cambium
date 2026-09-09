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
import { User } from '../users/entities/user.entity';
import { ResearchInterest } from '../users/entities/research-interest.entity';
import { RegisterDto, LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  private readonly jwtSecret = process.env.JWT_SECRET || 'cambium_jwt_secret_key_2026';

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(ResearchInterest)
    private readonly interestRepo: Repository<ResearchInterest>,
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
    const token = this.generateToken(saved.id);

    return {
      success: true,
      message: 'User registered successfully!',
      token,
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

    const token = this.generateToken(user.id);

    return {
      success: true,
      message: 'Login successful!',
      token,
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

  generateToken(userId: string): string {
    return jwt.sign({ id: userId }, this.jwtSecret, { expiresIn: '30d' });
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
