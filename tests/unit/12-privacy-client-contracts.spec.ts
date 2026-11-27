/**
 * Cambium Program 09 — Frontend Privacy & Consent Contract Tests
 *
 * Verifies real backend privacy API bindings, notice versioning, elimination of
 * fabricated legal addresses/contacts, and removal of synthetic export sessions.
 */
import * as fs from 'fs';
import * as path from 'path';

describe('Program 09 — Frontend Privacy UX, Notice & Export Contracts', () => {
  test('PrivacyContent removes fabricated corporate addresses, DPO emails, and overclaimed certifications', () => {
    const filePath = path.resolve(
      __dirname,
      '../../client/components/legal/PrivacyContent.tsx',
    );
    const source = fs.readFileSync(filePath, 'utf8');

    expect(source).not.toContain('77 Massachusetts Avenue');
    expect(source).not.toContain('dpo@cambium.mit.edu');
    expect(source).not.toContain('Cambium Research Intelligence Technologies Inc.');
    expect(source).not.toContain('Cambium Trust Europe Ltd.');
    expect(source).not.toContain('certified under GDPR');

    expect(source).toContain('[OPERATOR_LEGAL_ENTITY_NAME');
    expect(source).toContain('[GRIEVANCE_OFFICER_EMAIL');
    expect(source).toContain('[PRIVACY_CONTACT_EMAIL]');
    expect(source).toContain('Digital Personal Data Protection Act, 2023');
    expect(source).toContain('does not itself constitute legal certification');
  });

  test('scholar-export removes hardcoded MacBook Pro, Cambridge location, fake ORCID, and Math.random signature', () => {
    const filePath = path.resolve(__dirname, '../../client/lib/scholar-export.ts');
    const source = fs.readFileSync(filePath, 'utf8');

    expect(source).not.toContain('MacBook Pro');
    expect(source).not.toContain('Cambridge, MA, USA');
    expect(source).not.toContain('0000-0002-1825-0097');
    expect(source).not.toContain('Math.random()');
    expect(source).toContain('local-browser-archive-unsigned');
  });

  test('CookieConsent includes versioned notice and wires backend consent recording helper', () => {
    const filePath = path.resolve(__dirname, '../../client/components/CookieConsent.tsx');
    const source = fs.readFileSync(filePath, 'utf8');

    expect(source).toContain('CONSENT_NOTICE_VERSION');
    expect(source).toContain('v2026-11');
    expect(source).toContain('recordPrivacyConsent');
    expect(source).toContain('Essential Only');
    expect(source).toContain('Accept Optional Analytics');
  });

  test('Settings page binds Privacy toggles, AI opt-in, Export, and Erasure to backend APIs', () => {
    const filePath = path.resolve(__dirname, '../../client/app/(protected)/settings/page.tsx');
    const source = fs.readFileSync(filePath, 'utf8');

    expect(source).toContain('getPrivacyPreferences');
    expect(source).toContain('updatePrivacyPreferences');
    expect(source).toContain('exportPersonalPrivacyArchive');
    expect(source).toContain('executeAccountErasure');
    expect(source).toContain('aiProcessingConsent');
    expect(source).toContain('optionalAnalyticsConsent');
    expect(source).not.toContain('scholar@cambium.mit.edu');
    expect(source).not.toContain('Privacy settings saved.');
  });
});
