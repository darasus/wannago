import {createContext} from 'trpc';
import {appRouter} from 'trpc/src/routers/_app';
import {createNextApiHandler} from '@trpc/server/adapters/next';
import {ONE_WEEK_IN_SECONDS} from 'const';

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
      paths &&
      paths.every(
        path =>
          path.includes('event.getRandomExample') ||
          path.includes('event.getOrganizer')
      );
    const allOk = errors.length === 0;
    const isQuery = type === 'query';

    if (shouldCache && allOk && isQuery) {
      return {
        headers: {
          'Cache-Control': `s-maxage=60, stale-while-revalidate=${ONE_WEEK_IN_SECONDS}`,
        },
      };
    }

    return {};
  },
});
