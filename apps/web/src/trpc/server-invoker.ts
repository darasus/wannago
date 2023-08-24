'use server';

import {experimental_createTRPCNextAppDirServer} from '@trpc/next/app-dir/server';
import {experimental_nextCacheLink} from '@trpc/next/app-dir/links/nextCache';
import {AppRouter, appRouter} from 'api';
import superjson from 'superjson';
import {createContext} from 'api/src/context';

export const api = experimental_createTRPCNextAppDirServer<AppRouter>({
  config() {
    return {
      transformer: superjson,
      links: [
        experimental_nextCacheLink({
          revalidate: 5,
          createContext,
          router: appRouter,
        }),
      ],
    };
  },
});
