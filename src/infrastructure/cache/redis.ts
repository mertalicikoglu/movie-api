import Redis from 'ioredis';
import config from '../config';

class RedisCache {
    private client: Redis;

    constructor() {
        this.client = new Redis({
            host: config.redis.host,
            port: config.redis.port,
            password: config.redis.password,
        });

        this.client.on('error', (err: Error) => {
            console.error('Redis Client Error:', err);
        });

        this.client.on('connect', () => {
            console.log('Connected to Redis');
        });
    }

    async set(key: string, value: any, ttl?: number): Promise<void> {
        const stringValue = JSON.stringify(value);
        if (ttl) {
            await this.client.setex(key, ttl, stringValue);
        } else {
            await this.client.set(key, stringValue);
        }
    }

    async get(key: string): Promise<any> {
        const value = await this.client.get(key);
        return value ? JSON.parse(value) : null;
    }

    async del(key: string | string[]): Promise<void> {
        if (Array.isArray(key)) {
            await this.client.del(...key);
        } else {
            await this.client.del(key);
        }
    }

    async clear(): Promise<void> {
        await this.client.flushall();
    }

    async delByPattern(pattern: string): Promise<void> {
        const keys = await this.client.keys(pattern);
        if (keys.length > 0) {
            await this.client.del(keys);
        }
    }

    async keys(pattern: string): Promise<string[]> {
        return this.client.keys(pattern);
    }
}

export const redisCache = new RedisCache(); 