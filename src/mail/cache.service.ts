import { Injectable } from '@nestjs/common';
import Redis from 'ioredis'

@Injectable()
export class CacheService {
  private redis;

  constructor() {
    this.redis = new Redis(); // 기본 Redis 설정
  }

  async set(key: string, value: string, options?: { ttl: number }) {
    if (options?.ttl) {
      await this.redis.set(key, value, 'EX', options.ttl);
    } else {
      await this.redis.set(key, value);
    }
  }

  async get(key: string): Promise<string | null> {
    return await this.redis.get(key);
  }

  async del(key: string): Promise<void> {
    await this.redis.del(key);
  }
}
