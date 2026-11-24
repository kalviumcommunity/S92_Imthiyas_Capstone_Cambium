import { Injectable, Logger, Optional } from '@nestjs/common';
import { ChatGateway } from '../chat/chat.gateway';

export interface NetworkDiagnosticsPayload {
  status: 'OPTIMAL' | 'DEGRADED';
  timestamp: string;
  uptimeSeconds: number;
  server: {
    nodeVersion: string;
    environment: string;
    memoryRssMb: number;
    heapUsedMb: number;
  };
  clientConnection: {
    ip: string;
    forwardedFor?: string;
    realIp?: string;
    userAgent?: string;
    protocol: string;
    isSecure: boolean;
  };
  websocketGateway: {
    status: 'ACTIVE' | 'STANDBY';
    activeRooms: number;
    trackedPresenceMembers: number;
    activeSectionLocks: number;
    adapter: 'Redis' | 'In-Memory Fallback';
  };
}

@Injectable()
export class NetworkDiagnosticsService {
  private readonly logger = new Logger(NetworkDiagnosticsService.name);

  constructor(@Optional() private readonly chatGateway?: ChatGateway) {}

  getClientIp(req: any): string {
    const forwarded = req.headers['x-forwarded-for'];
    if (forwarded) {
      const parts = forwarded.split(',');
      return parts[0].trim();
    }
    return req.headers['x-real-ip'] || req.socket?.remoteAddress || '127.0.0.1';
  }

  getDiagnostics(req: any): NetworkDiagnosticsPayload {
    const mem = process.memoryUsage();
    const clientIp = this.getClientIp(req);
    const forwardedFor = req.headers['x-forwarded-for'] as string | undefined;
    const realIp = req.headers['x-real-ip'] as string | undefined;
    const userAgent = req.headers['user-agent'] as string | undefined;
    const isSecure = Boolean(req.secure || req.headers['x-forwarded-proto'] === 'https');
    const wsStats = this.chatGateway?.getDiagnosticsSummary?.() || {
      activeRooms: 0,
      trackedPresenceMembers: 0,
      activeSectionLocks: 0,
    };

    return {
      status: 'OPTIMAL',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      server: {
        nodeVersion: process.version,
        environment: process.env.NODE_ENV || 'development',
        memoryRssMb: Math.round(mem.rss / (1024 * 1024)),
        heapUsedMb: Math.round(mem.heapUsed / (1024 * 1024)),
      },
      clientConnection: {
        ip: clientIp,
        forwardedFor,
        realIp,
        userAgent,
        protocol: req.httpVersion ? `HTTP/${req.httpVersion}` : 'HTTP/1.1',
        isSecure,
      },
      websocketGateway: {
        status: this.chatGateway ? 'ACTIVE' : 'STANDBY',
        activeRooms: wsStats.activeRooms,
        trackedPresenceMembers: wsStats.trackedPresenceMembers,
        activeSectionLocks: wsStats.activeSectionLocks,
        adapter: process.env.REDIS_HOST || process.env.REDIS_URL ? 'Redis' : 'In-Memory Fallback',
      },
    };
  }
}
