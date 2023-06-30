'use server';

import {loggerLink} from '@trpc/client';
import {experimental_createTRPCNextAppDirServer} from '@trpc/next/app-dir/server';
import {AppRouter} from 'api';
import {cookies, headers} from 'next/headers';
import superjson from 'superjson';
import {endingLink} from './shared';

export const api = experimental_createTRPCNextAppDirServer<AppRouter>({
  config() {
    return {
      transformer: superjson,
      links: [
        loggerLink({
          enabled: (op) => true,
        }),
        endingLink({
          headers: {
            ...Object.fromEntries(headers().entries()),
            cookie: cookies().toString(),
            'x-trpc-source': 'rsc-http',
          },
        }),
      ],
    };
  },
});
