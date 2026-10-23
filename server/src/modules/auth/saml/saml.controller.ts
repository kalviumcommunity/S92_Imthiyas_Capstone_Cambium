import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  Res,
  Header,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import type { Response } from 'express';
import { SamlService } from './saml.service';

const REFRESH_COOKIE_NAME = 'cambium_refresh_token';
const REFRESH_COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

@ApiTags('Institutional SAML 2.0 SSO')
@Controller('api/auth/saml')
export class SamlController {
  constructor(private readonly samlService: SamlService) {}

  @Get('metadata')
  @Header('Content-Type', 'application/xml; charset=utf-8')
  @ApiOperation({ summary: 'Export OASIS SAML 2.0 Service Provider (SP) Metadata XML' })
  @ApiResponse({ status: 200, description: 'SAML 2.0 XML metadata descriptor' })
  getSpMetadata(@Res() res: Response) {
    const xml = this.samlService.generateSpMetadata();
    return res.status(HttpStatus.OK).send(xml);
  }

  @Get('login/:institutionId')
  @ApiOperation({ summary: 'Initiate SP-Initiated SAML 2.0 AuthnRequest redirect for institution' })
  @ApiParam({ name: 'institutionId', description: 'Institution identifier (e.g. stanford, mit, oxford, harvard)' })
  initiateLogin(
    @Param('institutionId') institutionId: string,
    @Query('relayState') relayState?: string,
  ) {
    return this.samlService.generateAuthnRequest(institutionId, relayState);
  }

  @Post('acs')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Assertion Consumer Service (ACS) endpoint processing SAMLResponse XML' })
  @ApiBody({ schema: { properties: { SAMLResponse: { type: 'string' } } } })
  @ApiResponse({ status: 200, description: 'Scholar authenticated with JWT token pair' })
  async consumeAssertion(
    @Body('SAMLResponse') samlResponse: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    let rawXml = samlResponse;
    // Check if response is base64 encoded
    if (!samlResponse.trim().startsWith('<')) {
      try {
        rawXml = Buffer.from(samlResponse, 'base64').toString('utf-8');
      } catch {
        rawXml = samlResponse;
      }
    }

    const attrs = this.samlService.parseSamlAssertion(rawXml);
    const result = this.samlService.processScholarLogin(attrs);

    // Set HttpOnly refresh cookie
    res.cookie(REFRESH_COOKIE_NAME, result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/api/auth',
      maxAge: REFRESH_COOKIE_MAX_AGE_MS,
    });

    return result;
  }

  @Post('mock-idp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Simulate University IdP authentication for offline and CI verification' })
  @ApiBody({
    schema: {
      properties: {
        eppn: { type: 'string', example: 'elena.rodriguez@stanford.edu' },
        fullName: { type: 'string', example: 'Dr. Elena Rodriguez' },
        affiliation: { type: 'string', example: 'faculty' },
      },
    },
  })
  async simulateUniversityLogin(
    @Body() body: { eppn?: string; fullName?: string; affiliation?: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const mockXml = this.samlService.generateMockIdpAssertion({
      eppn: body.eppn || 'elena.rodriguez@stanford.edu',
      fullName: body.fullName || 'Dr. Elena Rodriguez',
      affiliation: (body.affiliation as any) || 'faculty',
      email: body.eppn || 'elena.rodriguez@stanford.edu',
    });

    const attrs = this.samlService.parseSamlAssertion(mockXml);
    const result = this.samlService.processScholarLogin(attrs);

    res.cookie(REFRESH_COOKIE_NAME, result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/api/auth',
      maxAge: REFRESH_COOKIE_MAX_AGE_MS,
    });

    return result;
  }
}
