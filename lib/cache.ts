import {Redis} from '@upstash/redis';

export class CacheService {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });

  fetch = async <T>(
    key: string,
    fetcher: () => Promise<T | null>,
    expires: number
  ) => {
    const existing = await this.get<T>(key);

    if (existing !== null) return existing;

    return this.set<T>(key, fetcher, expires);
  };

  get = async <T>(key: string): Promise<T | null> => {
    const value = await this.redis.get<T>(key);
    if (value === null) return null;
    return value;
  };

  set = async <T>(
    key: string,
    fetcher: () => Promise<T | null>,
    expires: number
  ) => {
    const value = await fetcher();
    if (value) {
      await this.redis.set(key, value, {
        ex: expires,
      });
    }
    return value;
  };

  del = async (key: string) => {
    await this.redis.del(key);
  };

  perge = async () => {
    await this.redis.flushall();
  };
}
