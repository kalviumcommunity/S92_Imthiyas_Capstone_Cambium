import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuditService } from './audit.service';
import { JwtAuthGuard, AuthenticatedUser } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('Audit & Compliance Ledger')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller(['audit', 'api/audit', 'api/v1/audit'])
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  @Roles(
    UserRole.SUPER_ADMIN,
    UserRole.UNIVERSITY_LEADERSHIP,
    UserRole.RD_DIRECTOR,
    UserRole.COMPLIANCE_OFFICER,
    UserRole.PI,
  )
  @ApiOperation({
    summary: 'Retrieve cryptographic audit logs with SHA-256 receipts (Authorized Leadership & Compliance)',
    description: 'Returns paginated immutable audit records including previousHash, currentHash, and entity mutations.',
  })
  @ApiResponse({ status: 200, description: 'Paginated audit logs returned successfully.' })
  async getAuditLogs(
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
    @Query('action') action?: string,
    @Query('entityName') entityName?: string,
  ) {
    return this.auditService.getAuditLogs({
      limit: limit ? Number(limit) : 50,
      offset: offset ? Number(offset) : 0,
      action,
      entityName,
    });
  }

  @Get('my')
  @ApiOperation({
    summary: 'Retrieve authenticated user personal audit receipts',
  })
  async getMyAuditLogs(
    @CurrentUser() user: AuthenticatedUser,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    return this.auditService.getAuditLogs({
      limit: limit ? Number(limit) : 50,
      offset: offset ? Number(offset) : 0,
      userId: user.id,
    });
  }

  @Get('verify')
  @Roles(
    UserRole.SUPER_ADMIN,
    UserRole.UNIVERSITY_LEADERSHIP,
    UserRole.RD_DIRECTOR,
    UserRole.COMPLIANCE_OFFICER,
  )
  @ApiOperation({
    summary: 'Cryptographically verify the SHA-256 ledger integrity from genesis to head',
  })
  @ApiResponse({ status: 200, description: 'Ledger integrity report returned.' })
  async verifyLedgerIntegrity() {
    return this.auditService.verifyLedgerIntegrity();
  }

  @Get(['export', 'export/signed'])
  @Roles(
    UserRole.SUPER_ADMIN,
    UserRole.UNIVERSITY_LEADERSHIP,
    UserRole.RD_DIRECTOR,
    UserRole.COMPLIANCE_OFFICER,
  )
  @ApiOperation({
    summary: 'Export signed cryptographic ledger proof for regulatory compliance',
  })
  @ApiResponse({ status: 200, description: 'Cryptographic proof package exported.' })
  async exportSignedProof() {
    return this.auditService.exportSignedProof();
  }
}
