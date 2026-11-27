import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Optional,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  UserPrivacyPreference,
} from './entities/user-privacy-preference.entity';
import {
  ConsentRecord,
  ConsentPurpose,
  ConsentAction,
} from './entities/consent-record.entity';
import {
  PrivacyRequest,
  PrivacyRequestStatus,
  PrivacyRequestType,
} from './entities/privacy-request.entity';
import {
  CreatePrivacyRequestDto,
  RecordConsentDto,
  UpdatePrivacyPreferencesDto,
} from './dto/privacy.dto';

export const CURRENT_PRIVACY_NOTICE_VERSION = 'v2026-11';

export interface EffectivePrivacyPreferences {
  userId: string;
  profilePublic: boolean;
  showInstitution: boolean;
  showPublications: boolean;
  allowSearch: boolean;
  aiProcessingConsent: boolean;
  optionalAnalyticsConsent: boolean;
  updatedAt: string;
}

@Injectable()
export class PrivacyService {
  private readonly logger = new Logger(PrivacyService.name);

  constructor(
    @InjectRepository(UserPrivacyPreference)
    private readonly prefRepo: Repository<UserPrivacyPreference>,
    @InjectRepository(ConsentRecord)
    private readonly consentRepo: Repository<ConsentRecord>,
    @InjectRepository(PrivacyRequest)
    private readonly requestRepo: Repository<PrivacyRequest>,
  ) {}

  private defaultPreferences(userId: string): EffectivePrivacyPreferences {
    return {
      userId,
      profilePublic: true,
      showInstitution: true,
      showPublications: false,
      allowSearch: true,
      aiProcessingConsent: false,
      optionalAnalyticsConsent: false,
      updatedAt: new Date().toISOString(),
    };
  }

  async getPreferences(userId: string): Promise<EffectivePrivacyPreferences> {
    const existing = await this.prefRepo.findOne({ where: { userId } });
    if (!existing) {
      return this.defaultPreferences(userId);
    }
    return {
      userId: existing.userId,
      profilePublic: existing.profilePublic,
      showInstitution: existing.showInstitution,
      showPublications: existing.showPublications,
      allowSearch: existing.allowSearch,
      aiProcessingConsent: existing.aiProcessingConsent,
      optionalAnalyticsConsent: existing.optionalAnalyticsConsent,
      updatedAt: existing.updatedAt?.toISOString?.() || new Date().toISOString(),
    };
  }

  async hasAiProcessingConsent(userId?: string): Promise<boolean> {
    if (!userId) return false;
    const prefs = await this.prefRepo.findOne({ where: { userId } });
    return Boolean(prefs?.aiProcessingConsent);
  }

  async updatePreferences(
    userId: string,
    dto: UpdatePrivacyPreferencesDto,
  ): Promise<EffectivePrivacyPreferences> {
    let record = await this.prefRepo.findOne({ where: { userId } });
    const previousAiConsent = record?.aiProcessingConsent ?? false;
    const previousAnalyticsConsent = record?.optionalAnalyticsConsent ?? false;

    if (!record) {
      record = this.prefRepo.create({
        userId,
        profilePublic: dto.profilePublic ?? true,
        showInstitution: dto.showInstitution ?? true,
        showPublications: dto.showPublications ?? false,
        allowSearch: dto.allowSearch ?? true,
        aiProcessingConsent: dto.aiProcessingConsent ?? false,
        optionalAnalyticsConsent: dto.optionalAnalyticsConsent ?? false,
      });
    } else {
      if (dto.profilePublic !== undefined) record.profilePublic = dto.profilePublic;
      if (dto.showInstitution !== undefined) record.showInstitution = dto.showInstitution;
      if (dto.showPublications !== undefined) record.showPublications = dto.showPublications;
      if (dto.allowSearch !== undefined) record.allowSearch = dto.allowSearch;
      if (dto.aiProcessingConsent !== undefined) {
        record.aiProcessingConsent = dto.aiProcessingConsent;
      }
      if (dto.optionalAnalyticsConsent !== undefined) {
        record.optionalAnalyticsConsent = dto.optionalAnalyticsConsent;
      }
    }

    const saved = await this.prefRepo.save(record);
    const noticeVersion = dto.noticeVersion || CURRENT_PRIVACY_NOTICE_VERSION;
    const sourceInterface = dto.sourceInterface || 'settings_privacy';

    if (
      dto.aiProcessingConsent !== undefined &&
      dto.aiProcessingConsent !== previousAiConsent
    ) {
      await this.recordConsent(userId, {
        purpose: ConsentPurpose.AI_RESEARCH_ASSISTANT,
        action: dto.aiProcessingConsent ? ConsentAction.GRANTED : ConsentAction.WITHDRAWN,
        noticeVersion,
        sourceInterface,
      });
    }

    if (
      dto.optionalAnalyticsConsent !== undefined &&
      dto.optionalAnalyticsConsent !== previousAnalyticsConsent
    ) {
      await this.recordConsent(userId, {
        purpose: ConsentPurpose.OPTIONAL_ANALYTICS,
        action: dto.optionalAnalyticsConsent ? ConsentAction.GRANTED : ConsentAction.WITHDRAWN,
        noticeVersion,
        sourceInterface,
      });
    }

    return {
      userId: saved.userId,
      profilePublic: saved.profilePublic,
      showInstitution: saved.showInstitution,
      showPublications: saved.showPublications,
      allowSearch: saved.allowSearch,
      aiProcessingConsent: saved.aiProcessingConsent,
      optionalAnalyticsConsent: saved.optionalAnalyticsConsent,
      updatedAt: saved.updatedAt?.toISOString?.() || new Date().toISOString(),
    };
  }

  /**
   * Append-only consent ledger: inserts new historical record rather than mutating prior evidence.
   */
  async recordConsent(userId: string, dto: RecordConsentDto): Promise<ConsentRecord> {
    const entry = this.consentRepo.create({
      userId,
      purpose: dto.purpose,
      action: dto.action,
      noticeVersion: dto.noticeVersion || CURRENT_PRIVACY_NOTICE_VERSION,
      noticeLanguage: dto.noticeLanguage || 'en',
      sourceInterface: dto.sourceInterface || 'settings_privacy',
    });

    const saved = await this.consentRepo.save(entry);

    if (
      dto.purpose === ConsentPurpose.AI_RESEARCH_ASSISTANT ||
      dto.purpose === ConsentPurpose.OPTIONAL_ANALYTICS
    ) {
      let pref = await this.prefRepo.findOne({ where: { userId } });
      if (!pref) {
        pref = this.prefRepo.create({
          userId,
          profilePublic: true,
          showInstitution: true,
          showPublications: false,
          allowSearch: true,
          aiProcessingConsent:
            dto.purpose === ConsentPurpose.AI_RESEARCH_ASSISTANT
              ? dto.action === ConsentAction.GRANTED
              : false,
          optionalAnalyticsConsent:
            dto.purpose === ConsentPurpose.OPTIONAL_ANALYTICS
              ? dto.action === ConsentAction.GRANTED
              : false,
        });
      } else {
        if (dto.purpose === ConsentPurpose.AI_RESEARCH_ASSISTANT) {
          pref.aiProcessingConsent = dto.action === ConsentAction.GRANTED;
        } else {
          pref.optionalAnalyticsConsent = dto.action === ConsentAction.GRANTED;
        }
      }
      await this.prefRepo.save(pref);
    }

    return saved;
  }

  async listConsents(userId: string): Promise<ConsentRecord[]> {
    return this.consentRepo.find({
      where: { userId },
      order: { recordedAt: 'DESC' },
      take: 100,
    });
  }

  async submitRequest(userId: string, dto: CreatePrivacyRequestDto): Promise<PrivacyRequest> {
    const sanitizedDetails = dto.details ? dto.details.trim().slice(0, 1000) : null;
    const reqEntity = this.requestRepo.create({
      userId,
      requestType: dto.requestType,
      status: PrivacyRequestStatus.IDENTITY_VERIFIED,
      details: sanitizedDetails,
      resolutionSummary: null,
      retentionExceptionReason: null,
    });
    const saved = await this.requestRepo.save(reqEntity);
    this.logger.log(`Privacy request [${saved.id}] (${dto.requestType}) logged for actor ${userId}`);
    return saved;
  }

  async listRequests(userId: string): Promise<PrivacyRequest[]> {
    return this.requestRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: 50,
    });
  }

  async updateRequestStatus(
    requestId: string,
    userId: string,
    status: PrivacyRequestStatus,
    resolutionSummary?: string,
    retentionExceptionReason?: string,
  ): Promise<PrivacyRequest> {
    const req = await this.requestRepo.findOne({ where: { id: requestId, userId } });
    if (!req) {
      throw new NotFoundException('Privacy request not found for this account');
    }
    req.status = status;
    if (resolutionSummary !== undefined) req.resolutionSummary = resolutionSummary;
    if (retentionExceptionReason !== undefined) {
      req.retentionExceptionReason = retentionExceptionReason;
    }
    return this.requestRepo.save(req);
  }
}
