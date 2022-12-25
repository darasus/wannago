import {env} from '../lib/env/client';

export const isProd = env.NEXT_PUBLIC_VERCEL_ENV === 'production';
