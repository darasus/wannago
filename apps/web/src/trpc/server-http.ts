'use server';

import {loggerLink} from '@trpc/client';
import {experimental_createTRPCNextAppDirServer} from '@trpc/next/app-dir/server';
import {AppRouter} from 'api';
import {cookies, headers} from 'next/headers';
import superjson from 'superjson';
import {endingLink} from './shared';
import {omit} from 'ramda';

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
            ...omit(
              [
                'Content-Length',
                'content-length',
                'Content-Type',
                'content-type',
              ],
              Object.fromEntries(headers().entries())
            ),
            cookie: cookies().toString(),
            'x-trpc-source': 'rsc-http',
          },
        }),
      ],
    };
  },
});
