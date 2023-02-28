import 'server-only';
import {createTRPCProxyClient, httpBatchLink, loggerLink} from '@trpc/client';
import SuperJSON from 'superjson';
import {AppRouter} from './routers/_app';
import {headers} from 'next/headers';
import {getBaseUrl} from 'utils';

export const trpcProxyClient = createTRPCProxyClient<AppRouter>({
  transformer: SuperJSON,
  links: [
    loggerLink({enabled: () => process.env.NODE_ENV === 'development'}),
    httpBatchLink({
      url: `${getBaseUrl()}/api/trpc`,
      fetch(url, options) {
        return fetch(url, {
          ...options,
          credentials: 'include',
          next: {revalidate: 10},
        });
      },
      headers: () => {
        return {cookie: headers().get('cookie') ?? ''};
      },
    }),
  ],
});
