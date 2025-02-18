import { Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class CacheService {
  private readonly redis: Redis;
  private readonly logger = new Logger(CacheService.name); // NestJS Logger 사용

  constructor() {
    this.redis = new Redis({
      enableOfflineQueue: false, // Redis가 없을 때 요청 대기하지 않음
      retryStrategy: (times) => Math.min(times * 50, 2000), // 재연결 시도 (최대 2초 대기)
      reconnectOnError: (err) => {
        this.logger.warn(`[Redis Error]: ${err.message}`);
        return true; // 특정 에러 발생 시 재연결 시도
      },
    });

    // Redis 에러 로깅 (개발 모드에서만)
    this.redis.on('error', (err) => {
      if (process.env.NODE_ENV === 'development') {
        this.logger.warn(`[Redis Warning]: ${err.message}`);
      }
    });

    this.redis.on('connect', () => {
      this.logger.log('Connected to Redis');
    });

    this.redis.on('reconnecting', () => {
      this.logger.warn('Reconnecting to Redis...');
    });
  }

  async set(key: string, value: string, options?: { ttl: number }) {
    try {
      if (options?.ttl) {
        await this.redis.set(key, value, 'EX', options.ttl);
      } else {
        await this.redis.set(key, value);
      }
    } catch (err) {
      this.logger.warn(`[CacheService] Redis set error: ${err.message}`);
    }
  }

  async get(key: string): Promise<string | null> {
    try {
      return await this.redis.get(key);
    } catch (err) {
      this.logger.warn(`[CacheService] Redis get error: ${err.message}`);
      return null;
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.redis.del(key);
    } catch (err) {
      this.logger.warn(`[CacheService] Redis delete error: ${err.message}`);
    }
  }
}
