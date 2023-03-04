import {createContext} from 'trpc';
import {NextRequest} from 'next/server';
import {fetchRequestHandler} from '@trpc/server/adapters/fetch';
import {AppRouter, appRouter} from 'trpc/src/routers/_app';
import {createNextApiHandler} from '@trpc/server/adapters/next';

export default createNextApiHandler({
  router: appRouter,
  createContext,
  onError({error}) {
    if (error.code === 'INTERNAL_SERVER_ERROR') {
      console.error('Something went wrong', error);
    }
  },
  responseMeta({paths, type, errors}) {
    const shouldCache =
      paths && paths.every(path => path.includes('getRandomExample'));
    const allOk = errors.length === 0;
    const isQuery = type === 'query';

    if (shouldCache && allOk && isQuery) {
      const ONE_WEEK_IN_SECONDS = 60 * 60 * 24 * 7;

      return {
        headers: {
          'Cache-Control': `s-maxage=60, stale-while-revalidate=${ONE_WEEK_IN_SECONDS}`,
        },
      };
    }

    return {};
  },
});
