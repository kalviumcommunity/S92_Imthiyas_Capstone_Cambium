import { describe, it, expect, beforeEach } from 'vitest';
import { SamlService } from './saml.service';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

describe('SamlService (Institutional SAML 2.0 / Shibboleth Provider)', () => {
  let service: SamlService;

  beforeEach(() => {
    service = new SamlService();
  });

  describe('SP Metadata Generation', () => {
    it('should generate valid OASIS SAML 2.0 SP Metadata XML', () => {
      const metadata = service.generateSpMetadata();
      expect(metadata).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(metadata).toContain('<md:EntityDescriptor');
      expect(metadata).toContain('<md:SPSSODescriptor');
      expect(metadata).toContain('AssertionConsumerService');
      expect(metadata).toContain('eduPersonPrincipalName');
    });
  });

  describe('AuthnRequest Dispatch', () => {
    it('should generate structured SP-initiated AuthnRequest with redirectUrl', () => {
      const req = service.generateAuthnRequest('stanford', '/opportunities');
      expect(req.id).toMatch(/^_cambium_[a-f0-9]{32}$/);
      expect(req.redirectUrl).toContain('https://idp.stanford.edu');
      expect(req.redirectUrl).toContain('SAMLRequest=');
      expect(req.redirectUrl).toContain('RelayState=%2Fopportunities');
    });
  });

  describe('Assertion Parsing & Attribute Extraction', () => {
    it('should parse valid InCommon/Shibboleth assertion and extract scholar attributes', () => {
      const mockXml = service.generateMockIdpAssertion({
        eppn: 'elena.rodriguez@stanford.edu',
        fullName: 'Dr. Elena Rodriguez',
        affiliation: 'faculty',
      });

      const attrs = service.parseSamlAssertion(mockXml);
      expect(attrs.eppn).toBe('elena.rodriguez@stanford.edu');
      expect(attrs.email).toBe('elena.rodriguez@stanford.edu');
      expect(attrs.fullName).toBe('Dr. Elena Rodriguez');
      expect(attrs.affiliation).toBe('faculty');
      expect(attrs.institution).toBe('STANFORD University');
    });

    it('should reject expired assertion with UnauthorizedException', () => {
      const pastTime = new Date(Date.now() - 3600 * 1000).toISOString();
      const expiredXml = `<saml2:Assertion xmlns:saml2="urn:oasis:names:tc:SAML:2.0:assertion">
        <saml2:Subject>
          <saml2:NameID>expired.scholar@mit.edu</saml2:NameID>
          <saml2:SubjectConfirmationData NotOnOrAfter="${pastTime}"/>
        </saml2:Subject>
      </saml2:Assertion>`;

      expect(() => service.parseSamlAssertion(expiredXml)).toThrow(UnauthorizedException);
    });

    it('should throw BadRequestException if assertion payload is missing or lacks NameID', () => {
      expect(() => service.parseSamlAssertion('')).toThrow(BadRequestException);
      expect(() => service.parseSamlAssertion('<empty></empty>')).toThrow(BadRequestException);
    });
  });

  describe('JWT Scholar Provisioning & Token Issuance', () => {
    it('should issue signed JWT access token and refresh token upon successful SAML authentication', () => {
      const attrs = {
        eppn: 'marcus.thorne@harvard.edu',
        email: 'marcus.thorne@harvard.edu',
        fullName: 'Prof. Marcus Thorne',
        institution: 'HARVARD University',
        affiliation: 'faculty' as const,
        federation: 'InCommon' as const,
      };

      const result = service.processScholarLogin(attrs);
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
      expect(result.scholar.role).toBe('REVIEWER'); // Faculty maps to REVIEWER role
      expect(result.scholar.authMethod).toBe('SAML_2.0_SHIBBOLETH');

      // Verify JWT payload
      const decoded: any = jwt.decode(result.accessToken);
      expect(decoded.email).toBe('marcus.thorne@harvard.edu');
      expect(decoded.role).toBe('REVIEWER');
    });
  });
});
