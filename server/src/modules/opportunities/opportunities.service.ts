import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Optional,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import {
  ResearchOpportunity,
  OpportunityType,
} from './entities/research-opportunity.entity';
import { Tag } from './entities/tag.entity';
import {
  CreateOpportunityDto,
  UpdateOpportunityDto,
  FilterOpportunityDto,
  RecommendationQueryDto,
} from './dto/opportunity.dto';
import { MultiTierCacheService } from '../performance/multi-tier-cache.service';

@Injectable()
export class OpportunitiesService {
  constructor(
    @InjectRepository(ResearchOpportunity)
    private readonly oppRepo: Repository<ResearchOpportunity>,
    @InjectRepository(Tag)
    private readonly tagRepo: Repository<Tag>,
    private readonly dataSource: DataSource,
    @Optional()
    private readonly cacheService?: MultiTierCacheService,
  ) {}

  /**
   * Find all opportunities with TypeORM QueryBuilder and relational joins.
   */
  async findAll(filters: FilterOpportunityDto) {
    const page = Math.max(Number(filters.page) || 1, 1);
    const limit = Math.min(Math.max(Number(filters.limit) || 50, 1), 100);
    const offset = (page - 1) * limit;

    const qb = this.oppRepo
      .createQueryBuilder('opp')
      .leftJoinAndSelect('opp.tags', 'tag')
      .leftJoinAndSelect('opp.createdBy', 'creator')
      .orderBy('opp.createdAt', 'DESC')
      .take(limit)
      .skip(offset);

    if (filters.type) {
      qb.andWhere('opp.type = :type', { type: filters.type });
    }

    if (filters.tag) {
      qb.andWhere('tag.name ILIKE :tag', { tag: `%${filters.tag}%` });
    }

    if (filters.search) {
      qb.andWhere(
        '(opp.title ILIKE :search OR opp.organization ILIKE :search OR opp.description ILIKE :search)',
        { search: `%${filters.search}%` },
      );
    }

    const [data, total] = await qb.getManyAndCount();
    return {
      success: true,
      count: data.length,
      total,
      page,
      limit,
      hasMore: offset + data.length < total,
      data,
    };
  }

  /**
   * Find single opportunity with relational eager loading.
   */
  async findOne(id: string) {
    const opp = await this.oppRepo.findOne({
      where: { id },
      relations: { tags: true, createdBy: true },
    });

    if (!opp) {
      throw new NotFoundException(`Research opportunity not found`);
    }

    return {
      success: true,
      data: opp,
    };
  }

  /**
   * Aggregate opportunity statistics using a single relational query (L1/L2 Cached).
   */
  async getOpportunityStats() {
    const fetchStats = async () => {
      const statsResult = await this.oppRepo
        .createQueryBuilder('opp')
        .select('COUNT(*)::int', 'total')
        .addSelect(`COUNT(*) FILTER (WHERE opp.type = 'Grant')::int`, 'grants')
        .addSelect(`COUNT(*) FILTER (WHERE opp.type = 'CFP')::int`, 'cfps')
        .addSelect(`COUNT(*) FILTER (WHERE opp.type = 'Journal')::int`, 'journals')
        .addSelect(`COUNT(*) FILTER (WHERE opp.type = 'Paper')::int`, 'papers')
        .getRawOne();

      return {
        success: true,
        stats: {
          total: Number(statsResult?.total || 0),
          grants: Number(statsResult?.grants || 0),
          cfps: Number(statsResult?.cfps || 0),
          journals: Number(statsResult?.journals || 0),
          papers: Number(statsResult?.papers || 0),
        },
      };
    };

    if (this.cacheService) {
      return this.cacheService.wrap('opp:stats:global', fetchStats, 120, ['opportunities']);
    }

    return fetchStats();
  }

  /**
   * Get upcoming deadlines using SQL timestamptz predicate.
   */
  async getUpcomingDeadlines(limit = 50) {
    const cappedLimit = Math.min(Math.max(Number(limit) || 50, 1), 100);
    const opportunities = await this.oppRepo
      .createQueryBuilder('opp')
      .leftJoinAndSelect('opp.tags', 'tag')
      .where('opp.deadline >= CURRENT_TIMESTAMP')
      .orderBy('opp.deadline', 'ASC')
      .take(cappedLimit)
      .getMany();

    return {
      success: true,
      count: opportunities.length,
      data: opportunities,
    };
  }

  /**
   * AI-powered Recommendation Engine using pgvector Cosine Distance (<=>)
   * with fallback to relational tag intersection.
   */
  async getRecommendations(dto: RecommendationQueryDto) {
    const limit = Math.min(Math.max(Number(dto.limit) || 10, 1), 50);
    const qb = this.oppRepo
      .createQueryBuilder('opp')
      .leftJoinAndSelect('opp.tags', 'tag');

    if (dto.type) {
      qb.andWhere('opp.type = :type', { type: dto.type });
    }

    // 1. Vector semantic search if user embedding is provided
    if (dto.userEmbedding && Array.isArray(dto.userEmbedding) && dto.userEmbedding.length > 0) {
      const vectorLiteral = `[${dto.userEmbedding.join(',')}]`;
      qb.andWhere('opp.embedding IS NOT NULL')
        .addSelect(`opp.embedding <=> :vectorLiteral`, 'cosine_distance')
        .setParameter('vectorLiteral', vectorLiteral)
        .orderBy('cosine_distance', 'ASC');
    } else if (dto.interests && Array.isArray(dto.interests) && dto.interests.length > 0) {
      // 2. Relational taxonomy matching across normalized tags
      qb.andWhere('tag.name IN (:...interests)', { interests: dto.interests })
        .orderBy('opp.createdAt', 'DESC');
    } else {
      qb.orderBy('opp.createdAt', 'DESC');
    }

    qb.take(limit);

    const data = await qb.getMany();
    return {
      success: true,
      count: data.length,
      data,
    };
  }

  /**
   * Creates an opportunity with normalized taxonomy tags.
   */
  async create(dto: CreateOpportunityDto, creatorId?: string) {
    const tags = await this.resolveTags(dto.tags);

    const opp = this.oppRepo.create({
      title: dto.title,
      type: dto.type,
      organization: dto.organization,
      deadline: dto.deadline ? new Date(dto.deadline) : undefined,
      description: dto.description,
      link: dto.link,
      createdById: creatorId,
      tags,
    });

    const saved = await this.oppRepo.save(opp);
    return {
      success: true,
      message: 'Research opportunity created successfully',
      data: saved,
    };
  }

  /**
   * Bulk creates opportunities using TypeORM QueryRunner inside an atomic transaction.
   */
  async bulkCreate(opportunitiesList: CreateOpportunityDto[], creatorId?: string) {
    if (!Array.isArray(opportunitiesList) || opportunitiesList.length === 0) {
      throw new BadRequestException('Please provide an array of opportunities to insert');
    }
    if (opportunitiesList.length > 100) {
      throw new BadRequestException('Bulk opportunity insert is bounded to a maximum of 100 items per request.');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const txTagRepo = queryRunner.manager.getRepository(Tag);
      const createdEntities: ResearchOpportunity[] = [];

      for (const item of opportunitiesList) {
        const tags = await this.resolveTags(item.tags, txTagRepo);
        const opp = queryRunner.manager.create(ResearchOpportunity, {
          title: item.title,
          type: item.type,
          organization: item.organization,
          deadline: item.deadline ? new Date(item.deadline) : undefined,
          description: item.description,
          link: item.link,
          createdById: creatorId,
          tags,
        });

        const saved = await queryRunner.manager.save(opp);
        createdEntities.push(saved);
      }

      await queryRunner.commitTransaction();
      return {
        success: true,
        count: createdEntities.length,
        message: `${createdEntities.length} research opportunities created successfully`,
        data: createdEntities,
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Updates an opportunity and synchronizes relational tags (creator or SuperAdmin only).
   */
  async update(id: string, dto: UpdateOpportunityDto, requesterId?: string, isAdmin = false) {
    const opp = await this.oppRepo.findOne({
      where: { id },
      relations: { tags: true },
    });

    if (!opp) {
      throw new NotFoundException('Research opportunity not found');
    }

    if (requesterId && !isAdmin && opp.createdById !== requesterId) {
      throw new ForbiddenException('Only the creator or a SuperAdmin can update this research opportunity.');
    }

    if (dto.title !== undefined) opp.title = dto.title;
    if (dto.type !== undefined) opp.type = dto.type;
    if (dto.organization !== undefined) opp.organization = dto.organization;
    if (dto.deadline !== undefined) opp.deadline = dto.deadline ? new Date(dto.deadline) : undefined;
    if (dto.description !== undefined) opp.description = dto.description;
    if (dto.link !== undefined) opp.link = dto.link;

    if (dto.tags !== undefined) {
      opp.tags = await this.resolveTags(dto.tags);
    }

    const updated = await this.oppRepo.save(opp);
    return {
      success: true,
      message: 'Research opportunity updated successfully',
      data: updated,
    };
  }

  /**
   * Adds or replaces tags on an existing opportunity (creator or SuperAdmin only).
   */
  async updateTags(id: string, newTags: string[], requesterId?: string, isAdmin = false) {
    const opp = await this.oppRepo.findOne({
      where: { id },
      relations: { tags: true },
    });

    if (!opp) {
      throw new NotFoundException('Research opportunity not found');
    }

    if (requesterId && !isAdmin && opp.createdById !== requesterId) {
      throw new ForbiddenException('Only the creator or a SuperAdmin can modify tags on this opportunity.');
    }

    const resolved = await this.resolveTags(newTags);
    const existingNames = new Set(opp.tags.map((t) => t.name.toLowerCase()));
    for (const tag of resolved) {
      if (!existingNames.has(tag.name.toLowerCase())) {
        opp.tags.push(tag);
      }
    }

    const saved = await this.oppRepo.save(opp);
    return {
      success: true,
      message: 'Opportunity tags updated successfully',
      data: saved,
    };
  }

  /**
   * Deletes an opportunity (creator or SuperAdmin only); dependent bookmarks and tags cascade.
   */
  async remove(id: string, requesterId?: string, isAdmin = false) {
    const opp = await this.oppRepo.findOne({ where: { id } });
    if (!opp) {
      throw new NotFoundException('Research opportunity not found');
    }

    if (requesterId && !isAdmin && opp.createdById !== requesterId) {
      throw new ForbiddenException('Only the creator or a SuperAdmin can delete this research opportunity.');
    }

    await this.oppRepo.remove(opp);
    return {
      success: true,
      message: 'Research opportunity deleted successfully',
      data: {},
    };
  }

  /**
   * Helper: Resolves, normalizes, and deduplicates taxonomy tags in the database.
   */
  private async resolveTags(rawTags?: string[], repo: Repository<Tag> = this.tagRepo): Promise<Tag[]> {
    if (!rawTags || !Array.isArray(rawTags) || rawTags.length === 0) {
      return [];
    }

    const resolved: Tag[] = [];
    for (const raw of rawTags) {
      const trimmed = raw.trim();
      if (!trimmed) continue;

      let tag = await repo.findOne({ where: { name: trimmed } });
      if (!tag) {
        tag = repo.create({ name: trimmed });
        tag = await repo.save(tag);
      }
      resolved.push(tag);
    }

    return resolved;
  }
}
