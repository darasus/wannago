'use server';

import {loggerLink} from '@trpc/client';
import {experimental_nextCacheLink} from '@trpc/next/app-dir/links/nextCache';
import {experimental_createTRPCNextAppDirServer} from '@trpc/next/app-dir/server';
import SuperJSON from 'superjson';
import {createContext} from 'api/src/context';
import {AppRouter} from 'api';
import {appRouter} from 'api/src/root';

/**
 * This client invokes procedures directly on the server without fetching over HTTP.
 */
export const api = experimental_createTRPCNextAppDirServer<AppRouter>({
  config() {
    return {
      transformer: SuperJSON,
      links: [
        loggerLink({
          enabled: (op) => true,
        }),
        experimental_nextCacheLink({
          // requests are cached for 5 seconds
          revalidate: 5,
          router: appRouter,
          createContext: createContext,
        }),
      ],
    };
  },
});
