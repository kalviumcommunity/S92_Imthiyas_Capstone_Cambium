import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { ResearchInterest } from './entities/research-interest.entity';
import { CreateUserDto, UpdateUserDto, AddInterestsDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(ResearchInterest)
    private readonly interestRepo: Repository<ResearchInterest>,
  ) {}

  async findAll() {
    const users = await this.userRepo.find({
      relations: {
        researchInterests: true,
        bookmarks: { opportunity: true },
      },
    });

    return {
      success: true,
      count: users.length,
      data: users,
    };
  }

  async findOne(id: string) {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: {
        researchInterests: true,
        bookmarks: { opportunity: { tags: true } },
        createdOpportunities: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      success: true,
      data: user,
    };
  }

  async create(dto: CreateUserDto) {
    const existing = await this.userRepo.findOne({ where: { email: dto.email } });
    if (existing) {
      throw new BadRequestException('User with this email already exists');
    }

    const interests = await this.resolveInterests(dto.researchInterests);

    const generatedUsername = dto.email.split('@')[0] + Math.floor(Math.random() * 1000);

    const user = this.userRepo.create({
      username: generatedUsername,
      email: dto.email,
      fullName: dto.fullName,
      passwordHash: 'INITIAL_SSO_PLACEHOLDER',
      institution: dto.institution,
      researchInterests: interests,
    });

    const saved = await this.userRepo.save(user);
    return {
      success: true,
      message: 'User created successfully',
      data: saved,
    };
  }

  async addInterests(userId: string, dto: AddInterestsDto) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: { researchInterests: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const newInterests = await this.resolveInterests(dto.interests);
    const existingSlugs = new Set(user.researchInterests.map((i) => i.slug));

    for (const interest of newInterests) {
      if (!existingSlugs.has(interest.slug)) {
        user.researchInterests.push(interest);
      }
    }

    const saved = await this.userRepo.save(user);
    return {
      success: true,
      message: 'Research interests updated successfully',
      data: saved,
    };
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: { researchInterests: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (dto.fullName !== undefined) user.fullName = dto.fullName;
    if (dto.email !== undefined) user.email = dto.email;
    if (dto.institution !== undefined) user.institution = dto.institution;

    if (dto.researchInterests !== undefined) {
      user.researchInterests = await this.resolveInterests(dto.researchInterests);
    }

    const saved = await this.userRepo.save(user);
    return {
      success: true,
      message: 'User profile updated successfully',
      data: saved,
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
