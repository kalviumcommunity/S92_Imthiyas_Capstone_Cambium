import { Injectable, Logger, BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';

export interface SamlScholarAttributes {
  eppn: string; // eduPersonPrincipalName (e.g. elena@stanford.edu)
  email: string;
  fullName: string;
  institution: string;
  affiliation: 'faculty' | 'staff' | 'student' | 'researcher';
  federation: 'InCommon' | 'EduGAIN' | 'SWITCHaai' | 'Haka';
}

export interface SamlAuthResult {
  accessToken: string;
  refreshToken: string;
  scholar: {
    id: string;
    email: string;
    fullName: string;
    institution: string;
    role: string;
    federation: string;
    authMethod: string;
  };
}

@Injectable()
export class SamlService {
  private readonly logger = new Logger(SamlService.name);
  private readonly entityId = process.env.SAML_SP_ENTITY_ID || 'https://cambium.edu/saml/metadata';
  private readonly acsUrl = process.env.SAML_ACS_URL || 'http://localhost:5000/api/auth/saml/acs';
  private readonly jwtSecret = process.env.JWT_SECRET || 'cambium-super-secure-production-secret-key-2026';

  /**
   * Generates standard OASIS SAML 2.0 Service Provider (SP) Metadata XML
   * Conforms to InCommon Federation and eduGAIN interoperability guidelines.
   */
  generateSpMetadata(): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<md:EntityDescriptor xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata"
                     xmlns:ds="http://www.w3.org/2000/09/xmldsig#"
                     entityID="${this.entityId}">
  <md:SPSSODescriptor protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol"
                      AuthnRequestsSigned="false"
                      WantAssertionsSigned="true">
    <md:NameIDFormat>urn:oasis:names:tc:SAML:2.0:nameid-format:persistent</md:NameIDFormat>
    <md:NameIDFormat>urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress</md:NameIDFormat>
    <md:AssertionConsumerService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST"
                                 Location="${this.acsUrl}"
                                 index="1"
                                 isDefault="true"/>
    <md:AttributeConsumingService index="1">
      <md:ServiceName xml:lang="en">Cambium Research Platform</md:ServiceName>
      <md:RequestedAttribute Name="urn:oid:1.3.6.1.4.1.5923.1.1.1.6"
                             FriendlyName="eduPersonPrincipalName"
                             NameFormat="urn:oasis:names:tc:SAML:2.0:attrname-format:uri"
                             isRequired="true"/>
      <md:RequestedAttribute Name="urn:oid:0.9.2342.19200300.100.1.3"
                             FriendlyName="mail"
                             NameFormat="urn:oasis:names:tc:SAML:2.0:attrname-format:uri"
                             isRequired="true"/>
      <md:RequestedAttribute Name="urn:oid:2.5.4.42"
                             FriendlyName="givenName"
                             NameFormat="urn:oasis:names:tc:SAML:2.0:attrname-format:uri"/>
      <md:RequestedAttribute Name="urn:oid:2.5.4.4"
                             FriendlyName="sn"
                             NameFormat="urn:oasis:names:tc:SAML:2.0:attrname-format:uri"/>
      <md:RequestedAttribute Name="urn:oid:1.3.6.1.4.1.5923.1.1.1.1"
                             FriendlyName="eduPersonScopedAffiliation"
                             NameFormat="urn:oasis:names:tc:SAML:2.0:attrname-format:uri"/>
    </md:AttributeConsumingService>
  </md:SPSSODescriptor>
  <md:Organization>
    <md:OrganizationName xml:lang="en">Cambium Scholarship Foundation</md:OrganizationName>
    <md:OrganizationDisplayName xml:lang="en">Cambium Research Platform</md:OrganizationDisplayName>
    <md:OrganizationURL xml:lang="en">https://cambium.edu</md:OrganizationURL>
  </md:Organization>
</md:EntityDescriptor>`;
  }

  /**
   * Generates a signed or structured AuthnRequest for SP-initiated SSO
   */
  generateAuthnRequest(institutionId: string, relayState?: string): { id: string; redirectUrl: string; xml: string } {
    const id = `_cambium_${crypto.randomBytes(16).toString('hex')}`;
    const issueInstant = new Date().toISOString();

    const xml = `<samlp:AuthnRequest xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol"
                    xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion"
                    ID="${id}"
                    Version="2.0"
                    IssueInstant="${issueInstant}"
                    Destination="https://idp.${institutionId}.edu/idp/profile/SAML2/Redirect/SSO"
                    AssertionConsumerServiceURL="${this.acsUrl}"
                    ProtocolBinding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST">
      <saml:Issuer>${this.entityId}</saml:Issuer>
      <samlp:NameIDPolicy Format="urn:oasis:names:tc:SAML:2.0:nameid-format:persistent" AllowCreate="true"/>
    </samlp:AuthnRequest>`;

    const deflated = Buffer.from(xml).toString('base64');
    const redirectUrl = `https://idp.${institutionId}.edu/idp/profile/SAML2/Redirect/SSO?SAMLRequest=${encodeURIComponent(
      deflated,
    )}&RelayState=${encodeURIComponent(relayState || '/dashboard')}`;

    return { id, redirectUrl, xml };
  }

  /**
   * Parses and validates inbound SAML 2.0 XML assertion from an Identity Provider (IdP)
   */
  parseSamlAssertion(samlXml: string): SamlScholarAttributes {
    if (!samlXml || typeof samlXml !== 'string') {
      throw new BadRequestException('Invalid or missing SAML assertion payload');
    }

    // Verify time validity window if present
    const notOnOrAfterMatch = samlXml.match(/NotOnOrAfter="([^"]+)"/);
    if (notOnOrAfterMatch) {
      const expires = new Date(notOnOrAfterMatch[1]).getTime();
      if (Date.now() > expires) {
        throw new UnauthorizedException('SAML assertion has expired (NotOnOrAfter boundary breach)');
      }
    }

    // Extract ePPN (eduPersonPrincipalName) or NameID
    let eppn = '';
    const eppnMatch = samlXml.match(/<saml2?:Attribute[^>]*Name="[^"]*eduPersonPrincipalName"[^>]*>[\s\S]*?<saml2?:AttributeValue[^>]*>([^<]+)<\/saml2?:AttributeValue>/i);
    const nameIdMatch = samlXml.match(/<saml2?:NameID[^>]*>([^<]+)<\/saml2?:NameID>/i);

    if (eppnMatch) {
      eppn = eppnMatch[1].trim();
    } else if (nameIdMatch) {
      eppn = nameIdMatch[1].trim();
    } else {
      throw new BadRequestException('SAML assertion lacks required eduPersonPrincipalName or NameID');
    }

    // Extract email
    let email = eppn.includes('@') ? eppn : '';
    const mailMatch = samlXml.match(/<saml2?:Attribute[^>]*Name="[^"]*mail"[^>]*>[\s\S]*?<saml2?:AttributeValue[^>]*>([^<]+)<\/saml2?:AttributeValue>/i);
    if (mailMatch) {
      email = mailMatch[1].trim();
    }
    if (!email) {
      email = `${eppn.replace(/[^a-zA-Z0-9]/g, '.')}@incommon.cambium.edu`;
    }

    // Extract Display / Full Name
    let fullName = 'University Scholar';
    const cnMatch = samlXml.match(/<saml2?:Attribute[^>]*Name="[^"]*(displayName|cn)"[^>]*>[\s\S]*?<saml2?:AttributeValue[^>]*>([^<]+)<\/saml2?:AttributeValue>/i);
    if (cnMatch) {
      fullName = cnMatch[2].trim();
    } else {
      const givenNameMatch = samlXml.match(/<saml2?:Attribute[^>]*Name="[^"]*givenName"[^>]*>[\s\S]*?<saml2?:AttributeValue[^>]*>([^<]+)<\/saml2?:AttributeValue>/i);
      const snMatch = samlXml.match(/<saml2?:Attribute[^>]*Name="[^"]*sn"[^>]*>[\s\S]*?<saml2?:AttributeValue[^>]*>([^<]+)<\/saml2?:AttributeValue>/i);
      if (givenNameMatch && snMatch) {
        fullName = `${givenNameMatch[1].trim()} ${snMatch[1].trim()}`;
      }
    }

    // Extract Institution and Affiliation
    const domainMatch = email.match(/@([^.]+)\./);
    const institution = domainMatch ? `${domainMatch[1].toUpperCase()} University` : 'InCommon Research Institution';

    let affiliation: SamlScholarAttributes['affiliation'] = 'researcher';
    const affMatch = samlXml.match(/<saml2?:Attribute[^>]*Name="[^"]*eduPersonScopedAffiliation"[^>]*>[\s\S]*?<saml2?:AttributeValue[^>]*>([^<]+)<\/saml2?:AttributeValue>/i);
    if (affMatch) {
      const val = affMatch[1].toLowerCase();
      if (val.includes('faculty')) affiliation = 'faculty';
      else if (val.includes('staff')) affiliation = 'staff';
      else if (val.includes('student')) affiliation = 'student';
    }

    return {
      eppn,
      email,
      fullName,
      institution,
      affiliation,
      federation: 'InCommon',
    };
  }

  /**
   * Processes validated SAML scholar and generates Cambium JWT token credentials
   */
  processScholarLogin(attrs: SamlScholarAttributes): SamlAuthResult {
    const scholarId = `usr-sso-${crypto.createHash('sha256').update(attrs.eppn).digest('hex').substring(0, 16)}`;

    const accessToken = jwt.sign(
      {
        sub: scholarId,
        email: attrs.email,
        fullName: attrs.fullName,
        role: attrs.affiliation === 'faculty' ? 'REVIEWER' : 'SCHOLAR',
        institution: attrs.institution,
        authMethod: 'SAML_2.0_SHIBBOLETH',
      },
      this.jwtSecret,
      { expiresIn: '15m' },
    );

    const refreshToken = jwt.sign(
      {
        sub: scholarId,
        tokenVersion: 1,
        type: 'REFRESH',
      },
      this.jwtSecret,
      { expiresIn: '7d' },
    );

    this.logger.log(`Federated Scholar Authenticated via InCommon/SAML 2.0 [${attrs.email} - ${attrs.institution}]`);

    return {
      accessToken,
      refreshToken,
      scholar: {
        id: scholarId,
        email: attrs.email,
        fullName: attrs.fullName,
        institution: attrs.institution,
        role: attrs.affiliation === 'faculty' ? 'REVIEWER' : 'SCHOLAR',
        federation: attrs.federation,
        authMethod: 'SAML_2.0_SHIBBOLETH',
      },
    };
  }

  /**
   * Mock University IdP Assertion Generator (Zero-Cost Local & CI Testing Harness)
   */
  generateMockIdpAssertion(scholar: Partial<SamlScholarAttributes>): string {
    const now = new Date();
    const expiry = new Date(now.getTime() + 10 * 60 * 1000); // +10 minutes
    const eppn = scholar.eppn || 'elena.rodriguez@stanford.edu';
    const email = scholar.email || eppn;
    const fullName = scholar.fullName || 'Dr. Elena Rodriguez';
    const affiliation = scholar.affiliation || 'faculty';

    return `<saml2p:Response xmlns:saml2p="urn:oasis:names:tc:SAML:2.0:protocol"
                          xmlns:saml2="urn:oasis:names:tc:SAML:2.0:assertion"
                          ID="_idp_${crypto.randomBytes(8).toString('hex')}"
                          IssueInstant="${now.toISOString()}">
      <saml2:Issuer>https://idp.stanford.edu/idp/shibboleth</saml2:Issuer>
      <saml2:Assertion ID="_assert_${crypto.randomBytes(8).toString('hex')}"
                       IssueInstant="${now.toISOString()}">
        <saml2:Subject>
          <saml2:NameID Format="urn:oasis:names:tc:SAML:2.0:nameid-format:persistent">${eppn}</saml2:NameID>
          <saml2:SubjectConfirmation Method="urn:oasis:names:tc:SAML:2.0:cm:bearer">
            <saml2:SubjectConfirmationData NotOnOrAfter="${expiry.toISOString()}"/>
          </saml2:SubjectConfirmationData>
        </saml2:Subject>
        <saml2:Conditions NotBefore="${now.toISOString()}" NotOnOrAfter="${expiry.toISOString()}"/>
        <saml2:AttributeStatement>
          <saml2:Attribute Name="urn:oid:1.3.6.1.4.1.5923.1.1.1.6" FriendlyName="eduPersonPrincipalName">
            <saml2:AttributeValue>${eppn}</saml2:AttributeValue>
          </saml2:Attribute>
          <saml2:Attribute Name="urn:oid:0.9.2342.19200300.100.1.3" FriendlyName="mail">
            <saml2:AttributeValue>${email}</saml2:AttributeValue>
          </saml2:Attribute>
          <saml2:Attribute Name="urn:oid:2.5.4.3" FriendlyName="displayName">
            <saml2:AttributeValue>${fullName}</saml2:AttributeValue>
          </saml2:Attribute>
          <saml2:Attribute Name="urn:oid:1.3.6.1.4.1.5923.1.1.1.1" FriendlyName="eduPersonScopedAffiliation">
            <saml2:AttributeValue>${affiliation}@stanford.edu</saml2:AttributeValue>
          </saml2:Attribute>
        </saml2:AttributeStatement>
      </saml2:Assertion>
    </saml2p:Response>`;
  }
}
