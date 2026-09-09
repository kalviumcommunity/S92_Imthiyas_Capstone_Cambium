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

    return {
      success: true,
      data: user,
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
      relations: { user: true },
    });

    return {
      success: true,
      data: {
        opportunity,
        bookmarkedByCount: bookmarks.length,
        bookmarkedByUsers: bookmarks.map((b) => b.user),
      },
    };
  }

  async getRelationshipOverview() {
    const users = await this.userRepo.find({
      take: 5,
      relations: {
        researchInterests: true,
        bookmarks: { opportunity: true },
      },
    });

    const bookmarks = await this.bookmarkRepo.find({
      take: 5,
      relations: { user: true, opportunity: true },
    });

    const notifications = await this.notifRepo.find({
      take: 5,
      relations: { user: true, opportunity: true },
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
