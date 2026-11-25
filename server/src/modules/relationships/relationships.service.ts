import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { ResearchOpportunity } from '../opportunities/entities/research-opportunity.entity';
import { Bookmark } from '../bookmarks/entities/bookmark.entity';
import { Notification } from '../notifications/entities/notification.entity';

@Injectable()
export class RelationshipsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(ResearchOpportunity)
    private readonly oppRepo: Repository<ResearchOpportunity>,
    @InjectRepository(Bookmark)
    private readonly bookmarkRepo: Repository<Bookmark>,
    @InjectRepository(Notification)
    private readonly notifRepo: Repository<Notification>,
  ) {}

  /**
   * Retrieve user profile with full relational associations.
   */
  async getUserRelationships(userId: string) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: {
        researchInterests: true,
        bookmarks: { opportunity: { tags: true } },
        createdOpportunities: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { passwordHash: _ph, ...safeUser } = user;
    void _ph;

    return {
      success: true,
      data: safeUser,
    };
  }

  async getOpportunityRelationships(opportunityId: string) {
    const opportunity = await this.oppRepo.findOne({
      where: { id: opportunityId },
      relations: { createdBy: true, tags: true },
    });

    if (!opportunity) {
      throw new NotFoundException('Research opportunity not found');
    }

    const bookmarks = await this.bookmarkRepo.find({
      where: { opportunityId },
    });

    const creatorSummary = opportunity.createdBy
      ? {
          id: opportunity.createdBy.id,
          username: opportunity.createdBy.username,
          fullName: opportunity.createdBy.fullName,
        }
      : null;

    return {
      success: true,
      data: {
        opportunity: {
          ...opportunity,
          createdBy: creatorSummary,
        },
        bookmarkedByCount: bookmarks.length,
      },
    };
  }

  async getRelationshipOverview() {
    const users = await this.userRepo.find({
      take: 5,
      select: {
        id: true,
        username: true,
        fullName: true,
        role: true,
        institution: true,
      },
      relations: {
        researchInterests: true,
      },
    });

    const bookmarks = await this.bookmarkRepo.find({
      take: 5,
      relations: { opportunity: true },
    });

    const notifications = await this.notifRepo.find({
      take: 5,
      relations: { opportunity: true },
    });

    return {
      success: true,
      summary: {
        entityTypes: [
          'User',
          'ResearchInterest',
          'ResearchOpportunity',
          'Tag',
          'Bookmark',
          'Notification',
        ],
        relationships: [
          'User M:N ResearchInterest via user_interests junction table',
          'User 1:N ResearchOpportunity (users.id -> research_opportunities.created_by_id)',
          'User 1:N Bookmark & Opportunity 1:N Bookmark (bookmarks junction table)',
          'ResearchOpportunity M:N Tag via opportunity_tags junction table',
          'User 1:N Notification & Opportunity 1:N Notification',
        ],
      },
      data: {
        users,
        bookmarks,
        notifications,
      },
    };
  }
}
