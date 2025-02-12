import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class CacheService {
  private redis: Redis;

  constructor() {
    this.redis = new Redis({
      enableOfflineQueue: false, // Redis 서버가 없을 때 연결 시도를 중지
      retryStrategy: () => null, // 자동 재연결을 하지 않도록 설정
      reconnectOnError: () => false, // 연결 오류 발생 시 재연결 시도 중지
    });

    // 에러 로그 숨기기
    this.redis.on('error', (err) => {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[Redis Warning]:', err.message); // 개발 모드에서만 출력
      }
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
      console.warn(`[CacheService] Redis set error: ${err.message}`);
    }
  }

  async get(key: string): Promise<string | null> {
    try {
      return await this.redis.get(key);
    } catch (err) {
      console.warn(`[CacheService] Redis get error: ${err.message}`);
      return null;
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.redis.del(key);
    } catch (err) {
      console.warn(`[CacheService] Redis delete error: ${err.message}`);
    }
  }
}
