import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import Redis from 'ioredis';
import { Logger, INestApplicationContext } from '@nestjs/common';

export class RedisIoAdapter extends IoAdapter {
  private readonly adapterLogger = new Logger(RedisIoAdapter.name);
  private adapterConstructor: ReturnType<typeof createAdapter> | null = null;

  constructor(app: INestApplicationContext) {
    super(app);
  }

  async connectToRedis(): Promise<void> {
    const redisUrl = process.env.REDIS_URL;
    const redisHost = process.env.REDIS_HOST || '127.0.0.1';
    const redisPort = parseInt(process.env.REDIS_PORT || '6379', 10);
    const redisPassword = process.env.REDIS_PASSWORD || undefined;

    let pubClient: Redis | null = null;
    let subClient: Redis | null = null;

    try {
      const redisOptions = {
        lazyConnect: true,
        maxRetriesPerRequest: 1,
        connectTimeout: 2000,
        retryStrategy: () => null,
        reconnectOnError: () => false,
        enableOfflineQueue: false,
      };

      pubClient = redisUrl
        ? new Redis(redisUrl, redisOptions)
        : new Redis({
            host: redisHost,
            port: redisPort,
            password: redisPassword,
            ...redisOptions,
          });

      subClient = pubClient.duplicate();

      pubClient.on('error', (err) => {
        if (this.adapterConstructor) {
          this.adapterLogger.warn(`Redis pubClient error: ${err.message}`);
        }
      });
      subClient.on('error', (err) => {
        if (this.adapterConstructor) {
          this.adapterLogger.warn(`Redis subClient error: ${err.message}`);
        }
      });

      await Promise.all([pubClient.connect(), subClient.connect()]);

      this.adapterConstructor = createAdapter(pubClient, subClient);
      this.adapterLogger.log(' Distributed Socket.io Redis adapter connected successfully');
    } catch (err: any) {
      this.adapterLogger.warn(
        `Redis adapter unavailable (${err?.message || err}). Falling back to standalone Socket.io memory engine.`,
      );
      this.adapterConstructor = null;
      if (pubClient) {
        pubClient.removeAllListeners('error');
        pubClient.disconnect(false);
      }
      if (subClient) {
        subClient.removeAllListeners('error');
        subClient.disconnect(false);
      }
    }
  }

  override createIOServer(port: number, options?: ServerOptions): any {
    const serverOptions: ServerOptions = {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        credentials: true,
      },
      ...options,
    };

    if (this.adapterConstructor) {
      serverOptions.adapter = this.adapterConstructor;
    }

    return super.createIOServer(port, serverOptions);
  }
}
