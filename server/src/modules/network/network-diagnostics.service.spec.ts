import { describe, it, expect, beforeEach } from 'vitest';
import { NetworkDiagnosticsService } from './network-diagnostics.service';

describe('NetworkDiagnosticsService', () => {
  let service: NetworkDiagnosticsService;

  beforeEach(() => {
    service = new NetworkDiagnosticsService();
  });

  it('should extract client IP from X-Forwarded-For header with multiple proxies', () => {
    const req = {
      headers: {
        'x-forwarded-for': '203.0.113.195, 70.41.3.18, 150.172.238.178',
      },
    };
    const ip = service.getClientIp(req);
    expect(ip).toBe('203.0.113.195');
  });

  it('should fallback to X-Real-IP if X-Forwarded-For is not present', () => {
    const req = {
      headers: {
        'x-real-ip': '198.51.100.42',
      },
    };
    const ip = service.getClientIp(req);
    expect(ip).toBe('198.51.100.42');
  });

  it('should return complete network diagnostics payload', () => {
    const req = {
      headers: {
        'x-forwarded-for': '192.0.2.1',
        'x-forwarded-proto': 'https',
        'user-agent': 'CambiumResearchAgent/2.0',
      },
      httpVersion: '2.0',
      secure: false,
    };

    const diagnostics = service.getDiagnostics(req);

    expect(diagnostics.status).toBe('OPTIMAL');
    expect(diagnostics.clientConnection.ip).toBe('192.0.2.1');
    expect(diagnostics.clientConnection.isSecure).toBe(true);
    expect(diagnostics.clientConnection.protocol).toBe('HTTP/2.0');
    expect(diagnostics.server.nodeVersion).toBeDefined();
    expect(diagnostics.server.memoryRssMb).toBeGreaterThan(0);
  });
});
