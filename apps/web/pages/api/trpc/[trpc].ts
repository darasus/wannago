import {appRouter} from '../../../server/routers/_app';
import {createContext} from '../../../server/context';
import {NextRequest} from 'next/server';
import {fetchRequestHandler} from '@trpc/server/adapters/fetch';

export const config = {
  runtime: 'experimental-edge',
  regions: ['fra1'],
};

export default async function handler(req: NextRequest) {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    router: appRouter,
    req,
    createContext,
    onError({error}) {
      if (error.code === 'INTERNAL_SERVER_ERROR') {
        console.error('Something went wrong', error);
      }
    },
    batching: {
      enabled: true,
    },
    responseMeta({paths, type, errors}) {
      const shouldCache =
        paths &&
        paths.length === 1 &&
        paths.every(path => path.includes('getRandomExample'));
      const allOk = errors.length === 0;
      const isQuery = type === 'query';

      if (shouldCache && allOk && isQuery) {
        const ONE_WEEK_IN_SECONDS = 60 * 60 * 24 * 7;

        return {
          headers: {
            'Cache-Control': `s-maxage=10, stale-while-revalidate=${ONE_WEEK_IN_SECONDS}`,
          },
        };
      }

      return {};
    },
  });
}
