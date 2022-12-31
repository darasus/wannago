import {httpLink, loggerLink} from '@trpc/client';
import {createTRPCNext} from '@trpc/next';
import {AppRouter} from '../server/routers/_app';
import superjson from 'superjson';
import {getBaseUrl} from './getBaseUrl';

export const trpc = createTRPCNext<AppRouter>({
  config() {
    return {
      transformer: superjson,
      links: [
        loggerLink({
          enabled: opts =>
            process.env.NODE_ENV === 'development' ||
            (opts.direction === 'down' && opts.result instanceof Error),
        }),
        httpLink({
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
      queryClientConfig: {
        defaultOptions: {queries: {keepPreviousData: true}},
      },
    };
  },
  ssr: false,
});
