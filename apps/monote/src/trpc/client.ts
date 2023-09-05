'use client';

import {experimental_createTRPCNextAppDirClient} from '@trpc/next/app-dir/client';
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
