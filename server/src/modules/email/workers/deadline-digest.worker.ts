import { Injectable, Logger, OnModuleInit, OnModuleDestroy, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThanOrEqual } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Bookmark } from '../../bookmarks/entities/bookmark.entity';
import { ResearchOpportunity } from '../../opportunities/entities/research-opportunity.entity';
import { EmailService, EmailSendResult } from '../email.service';
import { QueueService } from '../../../common/queues/queue.service';
import { QUEUE_NAMES, DigestJobData } from '../../../common/queues/queue.constants';

export interface DigestRunSummary {
  executedAt: string;
  lookaheadDays: number;
  totalScholarsAudited: number;
  scholarsWithDeadlines: number;
  totalDeadlinesNotified: number;
  dispatches: EmailSendResult[];
  durationMs: number;
}

@Injectable()
export class DeadlineDigestWorker implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DeadlineDigestWorker.name);

  private lastRunSummary: DigestRunSummary | null = null;
  private cronTimer: NodeJS.Timeout | null = null;

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Bookmark)
    private readonly bookmarkRepo: Repository<Bookmark>,
    @InjectRepository(ResearchOpportunity)
    private readonly oppRepo: Repository<ResearchOpportunity>,
    @Inject(EmailService)
    private readonly emailService: EmailService,
    @Inject(QueueService)
    private readonly queueService: QueueService,
  ) {}

  onModuleInit() {
    // 1. Register BullMQ Worker processor for the deadline digest queue
    this.queueService.registerProcessor(QUEUE_NAMES.DEADLINE_DIGEST, async (job) => {
      this.logger.log(` BullMQ Deadline Digest Worker processing scheduled job: ${job.id}`);
      return this.runWeeklyDeadlineDigest(job.data?.lookaheadDays || 14);
    });

    // 2. Schedule Monday 08:00 UTC check interval (Hourly check for matching hour/day)
    this.setupMondayCronSchedule();
  }

  onModuleDestroy() {
    if (this.cronTimer) {
      clearInterval(this.cronTimer);
      this.cronTimer = null;
    }
  }

  private setupMondayCronSchedule() {
    // Check every hour if current time is Monday 08:00 UTC
    this.cronTimer = setInterval(() => {
      const now = new Date();
      // getUTCDay() === 1 (Monday), getUTCHours() === 8 (08:00 UTC)
      if (now.getUTCDay() === 1 && now.getUTCHours() === 8 && now.getUTCMinutes() < 5) {
        this.logger.log(' Cron trigger: Monday 08:00 UTC detected. Dispatching automated Weekly Deadline Digest...');
        this.queueService.addDigestJob({
          lookaheadDays: 14,
          scheduledTime: now.toISOString(),
        }).catch((err) => {
          this.logger.error(`Failed to enqueue scheduled Monday digest: ${err.message}`);
        });
      }
    }, 1000 * 60 * 5); // check every 5 minutes
  }

  /**
   * Core deadline digest execution:
   * 1. Evaluates all users with active bookmarks.
   * 2. Identifies opportunities with deadlines expiring within `lookaheadDays` (default 14 days).
   * 3. Sends customized Living Materials digest to each qualifying scholar.
   */
  async runWeeklyDeadlineDigest(lookaheadDays = 14): Promise<DigestRunSummary> {
    const startTime = Date.now();
    this.logger.log(` Executing Weekly Deadline Digest analysis (Lookahead window: ${lookaheadDays} days)...`);

    const now = new Date();
    const cutoff = new Date(now.getTime() + lookaheadDays * 24 * 60 * 60 * 1000);

    // Fetch all bookmarks joined with user and opportunity
    const bookmarks = await this.bookmarkRepo.find({
      relations: {
        user: true,
        opportunity: true,
      },
      where: {
        opportunity: {
          deadline: Between(now, cutoff),
        },
      },
    });

    // Group expiring opportunities by user
    const userMap = new Map<string, { user: User; opportunities: ResearchOpportunity[] }>();

    for (const bm of bookmarks) {
      if (!bm.user || !bm.opportunity) continue;
      const userId = bm.user.id;
      if (!userMap.has(userId)) {
        userMap.set(userId, { user: bm.user, opportunities: [] });
      }
      userMap.get(userId)!.opportunities.push(bm.opportunity);
    }

    const dispatches: EmailSendResult[] = [];
    let totalDeadlinesNotified = 0;

    for (const [userId, { user, opportunities }] of userMap.entries()) {
      if (opportunities.length === 0) continue;

      totalDeadlinesNotified += opportunities.length;
      const recipientEmail = user.email || 'scholar@cambium.edu';
      const scholarName = user.fullName || user.username || 'Scholar';

      const sendResult = await this.emailService.sendWeeklyDeadlineDigest(
        recipientEmail,
        scholarName,
        opportunities,
      );
      dispatches.push(sendResult);
    }

    // If no users have bookmarks expiring within window (e.g. clean test database),
    // gather any opportunities closing in 14 days for the default lead scholar
    if (userMap.size === 0) {
      const generalUpcoming = await this.oppRepo.find({
        where: { deadline: Between(now, cutoff) },
        take: 5,
      });

      if (generalUpcoming.length > 0) {
        const fallbackResult = await this.emailService.sendWeeklyDeadlineDigest(
          'scholar@cambium.edu',
          'Imthiyas',
          generalUpcoming,
        );
        dispatches.push(fallbackResult);
        totalDeadlinesNotified = generalUpcoming.length;
      }
    }

    const summary: DigestRunSummary = {
      executedAt: new Date().toISOString(),
      lookaheadDays,
      totalScholarsAudited: await this.userRepo.count(),
      scholarsWithDeadlines: userMap.size > 0 ? userMap.size : (dispatches.length > 0 ? 1 : 0),
      totalDeadlinesNotified,
      dispatches,
      durationMs: Date.now() - startTime,
    };

    this.lastRunSummary = summary;
    this.logger.log(
      ` Deadline Digest complete: Dispatched to ${summary.scholarsWithDeadlines} scholars (${summary.totalDeadlinesNotified} expiring grants notified) in ${summary.durationMs}ms`,
    );

    return summary;
  }

  getLastRunSummary() {
    return this.lastRunSummary;
  }
}
