'use client';

import {loggerLink} from '@trpc/client';
import {
  experimental_createActionHook,
  experimental_createTRPCNextAppDirClient,
  experimental_serverActionLink,
} from '@trpc/next/app-dir/client';
import {AppRouter} from 'api';
import superjson from 'superjson';
import {endingLink} from './shared';

export const api = experimental_createTRPCNextAppDirClient<AppRouter>({
  config() {
    return {
      transformer: superjson,
      links: [
        // loggerLink({
        //   enabled: (opts) =>
        //     process.env.NODE_ENV === 'development' ||
        //     (opts.direction === 'down' && opts.result instanceof Error),
        // }),
        endingLink(),
      ],
    };
  },
});

export const useAction = experimental_createActionHook({
  links: [loggerLink(), experimental_serverActionLink()],
  transformer: superjson,
});
