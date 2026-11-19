import { Controller, Get, Req, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { NetworkDiagnosticsService } from './network-diagnostics.service';
import { NetworkRateLimiterGuard, RateLimit } from './network-rate-limiter.guard';

@ApiTags('Network & Connection Engineering')
@Controller('api/v1/network')
@UseGuards(NetworkRateLimiterGuard)
export class NetworkDiagnosticsController {
  constructor(private readonly diagnosticsService: NetworkDiagnosticsService) {}

  @Get('diagnostics')
  @RateLimit(60, 60)
  @ApiOperation({
    summary: 'Inspect edge proxy headers, client IP resolution, and connection telemetry',
  })
  @ApiResponse({
    status: 200,
    description: 'Edge network diagnostics and WebSocket gateway state',
  })
  getDiagnostics(@Req() req: any) {
    return this.diagnosticsService.getDiagnostics(req);
  }

  @Get('ping')
  @RateLimit(120, 60)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'High-frequency low-overhead ping echo for round-trip latency benchmarking',
  })
  @ApiResponse({
    status: 200,
    description: 'Server epoch timestamp and pong echo',
  })
  ping() {
    return {
      status: 'PONG',
      serverTime: Date.now(),
      iso: new Date().toISOString(),
    };
  }
}
