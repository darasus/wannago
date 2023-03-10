import {createEdgeHandler} from '@upstash/edge-flags';
import {env} from 'server-env';

export default createEdgeHandler({
  maxAge: 60,
  redisUrl: env.UPSTASH_REDIS_REST_URL,
  redisToken: env.UPSTASH_REDIS_REST_TOKEN,
  environment: process.env.VERCEL_ENV as any,
});

export const config = {
  runtime: 'edge',
};
