import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard, AuthenticatedUser } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { PrivacyService } from './privacy.service';
import {
  CreatePrivacyRequestDto,
  RecordConsentDto,
  UpdatePrivacyPreferencesDto,
} from './dto/privacy.dto';

@ApiTags('Privacy & Data Governance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller(['api/privacy', 'api/v1/privacy'])
export class PrivacyController {
  constructor(private readonly privacyService: PrivacyService) {}

  @Get('preferences')
  @ApiOperation({ summary: 'Retrieve authenticated researcher privacy & opt-in preferences' })
  @ApiResponse({ status: 200, description: 'User privacy preferences returned' })
  async getPreferences(@CurrentUser() user: AuthenticatedUser) {
    const data = await this.privacyService.getPreferences(user.id);
    return { success: true, data };
  }

  @Put('preferences')
  @ApiOperation({ summary: 'Update authenticated researcher privacy & explicit AI/analytics preferences' })
  @ApiResponse({ status: 200, description: 'Privacy preferences updated and consent changes logged' })
  async updatePreferences(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdatePrivacyPreferencesDto,
  ) {
    const data = await this.privacyService.updatePreferences(user.id, dto);
    return { success: true, data };
  }

  @Get('consents')
  @ApiOperation({ summary: 'Retrieve append-only consent history for authenticated scholar' })
  async listConsents(@CurrentUser() user: AuthenticatedUser) {
    const data = await this.privacyService.listConsents(user.id);
    return { success: true, count: data.length, data };
  }

  @Post('consents')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Record a versioned consent grant or withdrawal action' })
  async recordConsent(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: RecordConsentDto,
  ) {
    const data = await this.privacyService.recordConsent(user.id, dto);
    return { success: true, data };
  }

  @Get('requests')
  @ApiOperation({ summary: 'List Data Principal rights / grievance / erasure requests for caller' })
  async listRequests(@CurrentUser() user: AuthenticatedUser) {
    const data = await this.privacyService.listRequests(user.id);
    return { success: true, count: data.length, data };
  }

  @Post('requests')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Submit a verifiable Data Principal access, correction, export, erasure, or grievance request' })
  async submitRequest(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreatePrivacyRequestDto,
  ) {
    const data = await this.privacyService.submitRequest(user.id, dto);
    return { success: true, data };
  }
}
