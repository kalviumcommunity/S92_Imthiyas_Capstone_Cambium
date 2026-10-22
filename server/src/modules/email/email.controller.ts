import { Controller, Post, Get, Body, HttpCode, HttpStatus, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { EmailService } from './email.service';
import { OpportunitiesService } from '../opportunities/opportunities.service';
import { DeadlineDigestWorker } from './workers/deadline-digest.worker';

@ApiTags('Scholar Communications (Email)')
@Controller('api/v1/email')
export class EmailController {
  constructor(
    @Inject(EmailService)
    private readonly emailService: EmailService,
    @Inject(OpportunitiesService)
    private readonly oppService: OpportunitiesService,
    @Inject(DeadlineDigestWorker)
    private readonly deadlineDigestWorker: DeadlineDigestWorker,
  ) {}

  @Post('digest/run')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Execute Monday 08:00 UTC Deadline Digest across all scholars with expiring bookmarks' })
  @ApiResponse({ status: 200, description: 'Digest run summary with scholar dispatch records' })
  async runDeadlineDigest(
    @Body()
    body?: {
      lookaheadDays?: number;
    },
  ) {
    const lookaheadDays = body?.lookaheadDays || 14;
    return this.deadlineDigestWorker.runWeeklyDeadlineDigest(lookaheadDays);
  }

  @Get('digest/status')
  @ApiOperation({ summary: 'Get status and execution summary of the last weekly deadline digest run' })
  async getDigestStatus() {
    return {
      worker: 'DeadlineDigestWorker',
      schedule: 'Every Monday at 08:00 UTC',
      lastRun: this.deadlineDigestWorker.getLastRunSummary(),
    };
  }

  @Post('digest-test')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Dispatch simulated weekly deadline digest to test recipient' })
  async triggerDigestTest(@Body() body: { email?: string; name?: string }) {
    const to = body.email || 'scholar@university.edu';
    const name = body.name || 'Imthiyas';

    const deadlines = await this.oppService.getUpcomingDeadlines();
    const opportunities = deadlines.data.slice(0, 5);

    return this.emailService.sendWeeklyDeadlineDigest(to, name, opportunities);
  }

  @Post('grant-alert-test')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Dispatch simulated semantic grant match alert' })
  async triggerGrantAlertTest(@Body() body: { email?: string; name?: string; opportunityId?: string }) {
    const to = body.email || 'scholar@university.edu';
    const name = body.name || 'Imthiyas';

    const all = await this.oppService.findAll({});
    const sample = all.data[0];

    if (!sample) {
      return { success: false, message: 'No opportunities found in catalog' };
    }

    return this.emailService.sendGrantMatchAlert(to, name, sample);
  }
}

