import {createEdgeHandler} from '@upstash/edge-flags';
import {env} from 'server-env';

export default createEdgeHandler({
  maxAge: 0,
  redisUrl: env.UPSTASH_REDIS_REST_URL,
  redisToken: env.UPSTASH_REDIS_REST_TOKEN,
  environment: env.VERCEL_ENV,
});

export const config = {
  runtime: 'edge',
};
