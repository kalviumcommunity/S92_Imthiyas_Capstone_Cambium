import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuditService } from './audit.service';

@ApiTags('Audit & Compliance Ledger')
@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  @ApiOperation({
    summary: 'Retrieve cryptographic audit logs with SHA-256 receipts',
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

  @Get('verify')
  @ApiOperation({
    summary: 'Cryptographically verify the SHA-256 ledger integrity from genesis to head',
    description: 'Recalculates the recursive cryptographic hash chain across all recorded blocks to detect any unauthorized data tampering.',
  })
  @ApiResponse({ status: 200, description: 'Ledger integrity report returned.' })
  async verifyLedgerIntegrity() {
    return this.auditService.verifyLedgerIntegrity();
  }

  @Get('export')
  @ApiOperation({
    summary: 'Export signed cryptographic ledger proof for regulatory compliance',
    description: 'Generates a signed, verifiable JSON audit ledger certificate compliant with NIST SP 800-53 and SOC 2 Type II standards.',
  })
  @ApiResponse({ status: 200, description: 'Cryptographic proof package exported.' })
  async exportSignedProof() {
    return this.auditService.exportSignedProof();
  }
}

