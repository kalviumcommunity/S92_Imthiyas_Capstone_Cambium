import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TelemetryService } from './telemetry.service';

@ApiTags('Telemetry & Observability')
@Controller('api/telemetry')
export class TelemetryController {
  constructor(private readonly telemetryService: TelemetryService) {}

  @Get('metrics')
  @ApiOperation({ summary: 'Retrieve high-level latency percentiles (p50, p90, p95, p99) and request metrics' })
  @ApiResponse({ status: 200, description: 'Calculated distributed telemetry metrics' })
  getMetrics() {
    return this.telemetryService.getMetrics();
  }

  @Get('traces')
  @ApiOperation({ summary: 'Retrieve recent distributed tracing spans and hierarchy' })
  @ApiResponse({ status: 200, description: 'Recent in-memory trace spans' })
  getTraces(@Query('limit') limit?: string) {
    const parsedLimit = limit ? parseInt(limit, 10) : 50;
    return this.telemetryService.getRecentSpans(parsedLimit);
  }

  @Get('otlp/v1/traces')
  @ApiOperation({ summary: 'Export traces in OpenTelemetry OTLP JSON format (Jaeger / Tempo / Grafana)' })
  @ApiResponse({ status: 200, description: 'OTLP JSON trace payload' })
  getOtlpTraces() {
    return this.telemetryService.getOtlpPayload();
  }
}
