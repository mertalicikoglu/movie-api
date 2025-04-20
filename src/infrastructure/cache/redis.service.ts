// src/infrastructure/cache/redis.service.ts
import { ICacheService } from '../../domain/repositories/cache.interface'; // from domain layer
import { redisCache } from './redis'; // Real redis client connection

export class RedisCacheService implements ICacheService {
    // Serialization/Deserialization operations are handled in this service
    async get<T>(key: string): Promise<T | null> {
        return redisCache.get(key);
    }

    async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
        await redisCache.set(key, value, ttlSeconds);
    }

    async del(key: string): Promise<void> {
        await redisCache.del(key);
    }

    async delByPattern(pattern: string): Promise<void> {
        await redisCache.delByPattern(pattern);
    }
}