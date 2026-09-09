import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bookmark } from './entities/bookmark.entity';
import { CreateBookmarkDto } from './dto/bookmark.dto';

@Injectable()
export class BookmarksService {
  constructor(
    @InjectRepository(Bookmark)
    private readonly bookmarkRepo: Repository<Bookmark>,
  ) {}

  /**
   * Find all bookmarks with relational eager loading.
   */
  async findAll() {
    const bookmarks = await this.bookmarkRepo.find({
      relations: { user: true, opportunity: { tags: true } },
      order: { createdAt: 'DESC' },
    });

    return {
      success: true,
      count: bookmarks.length,
      data: bookmarks,
    };
  }

  /**
   * Find bookmarks for a specific user with relational loading.
   */
  async findByUserId(userId: string) {
    const bookmarks = await this.bookmarkRepo.find({
      where: { userId },
      relations: { opportunity: { tags: true } },
      order: { createdAt: 'DESC' },
    });

    return {
      success: true,
      count: bookmarks.length,
      data: bookmarks,
    };
  }

  /**
   * Creates a bookmark, relying on the database unique constraint to prevent duplicates.
   */
  async create(dto: CreateBookmarkDto) {
    const existing = await this.bookmarkRepo.findOne({
      where: { userId: dto.user, opportunityId: dto.opportunity },
    });

    if (existing) {
      throw new BadRequestException('Opportunity already bookmarked by this user');
    }

    const bookmark = this.bookmarkRepo.create({
      userId: dto.user,
      opportunityId: dto.opportunity,
    });

    const saved = await this.bookmarkRepo.save(bookmark);

    return {
      success: true,
      message: 'Opportunity bookmarked successfully',
      data: saved,
    };
  }

  /**
   * Deletes a bookmark. Foreign keys handle referential integrity automatically.
   */
  async remove(id: string) {
    const bookmark = await this.bookmarkRepo.findOne({ where: { id } });

    if (!bookmark) {
      throw new NotFoundException('Bookmark not found');
    }

    await this.bookmarkRepo.remove(bookmark);

    return {
      success: true,
      message: 'Bookmark removed successfully',
      data: {},
    };
  }
}
