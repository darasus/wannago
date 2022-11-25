import {NextRequest} from 'next/server';
import {z} from 'zod';
import {CacheService} from '../../../lib/cache';
import {createEventCacheKey} from '../../../lib/cacheKeys';
import {prisma} from '../../../lib/prisma';
import {EventOutput} from '../../../model';

const cache = new CacheService();

export default async function handler(req: NextRequest) {
  if (req.method !== 'GET') {
    return new Response(JSON.stringify({error: 'Method Not Allowed'}), {
      status: 405,
      headers: {
        'content-type': 'application/json',
      },
    });
  }

  const {searchParams} = new URL(req.url);
  const id = searchParams.get('id');
  const parsedId = z.string().min(1).parse(id);

  const response = await cache.fetch(
    createEventCacheKey(parsedId),
    () => {
      return prisma.event.findFirst({
        where: {
          id: parsedId,
        },
      });
    },
    60
  );

  const event = EventOutput.parse(response);

  return new Response(JSON.stringify(event), {
    status: 200,
    headers: {
      'content-type': 'application/json',
    },
  });
}

export const config = {
  runtime: 'experimental-edge',
};
