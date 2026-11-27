import { Entity, PrimaryColumn, Column, UpdateDateColumn } from 'typeorm';

@Entity('user_privacy_preferences')
export class UserPrivacyPreference {
  @PrimaryColumn({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ name: 'profile_public', type: 'boolean', default: true })
  profilePublic: boolean;

  @Column({ name: 'show_institution', type: 'boolean', default: true })
  showInstitution: boolean;

  @Column({ name: 'show_publications', type: 'boolean', default: false })
  showPublications: boolean;

  @Column({ name: 'allow_search', type: 'boolean', default: true })
  allowSearch: boolean;

  /**
   * Explicit opt-in required before forwarding unpublished snippets/prompts to external LLM APIs.
   */
  @Column({ name: 'ai_processing_consent', type: 'boolean', default: false })
  aiProcessingConsent: boolean;

  @Column({ name: 'optional_analytics_consent', type: 'boolean', default: false })
  optionalAnalyticsConsent: boolean;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
