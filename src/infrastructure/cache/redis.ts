import Redis from 'ioredis';
import config from '../config';

class RedisCache {
    private client: Redis | null = null;

    private getClient(): Redis {
        if (!this.client) {
            // Skip Redis connection in test environment
            if (process.env.NODE_ENV === 'test') {
                console.log('Using mock Redis client for tests');
                this.client = new Redis() as Redis; // This will use the mocked version in tests
                return this.client;
            }

            console.log('Connecting to Redis...');
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
        return this.client;
    }

    async set(key: string, value: any, ttl?: number): Promise<void> {
        const client = this.getClient();
        const stringValue = JSON.stringify(value);
        if (ttl) {
            await client.setex(key, ttl, stringValue);
        } else {
            await client.set(key, stringValue);
        }
    }

    async get(key: string): Promise<any> {
        const client = this.getClient();
        const value = await client.get(key);
        return value ? JSON.parse(value) : null;
    }

    async del(key: string | string[]): Promise<void> {
        const client = this.getClient();
        if (Array.isArray(key)) {
            await client.del(...key);
        } else {
            await client.del(key);
        }
    }

    async clear(): Promise<void> {
        const client = this.getClient();
        await client.flushall();
    }

    async delByPattern(pattern: string): Promise<void> {
        const client = this.getClient();
        const keys = await client.keys(pattern);
        if (keys.length > 0) {
            await client.del(keys);
        }
    }

    async keys(pattern: string): Promise<string[]> {
        const client = this.getClient();
        return client.keys(pattern);
    }
}

export const redisCache = new RedisCache(); 