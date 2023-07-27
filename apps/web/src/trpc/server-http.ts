'use server';

import {experimental_createTRPCNextAppDirServer} from '@trpc/next/app-dir/server';
import {AppRouter} from 'api';
import {cookies, headers} from 'next/headers';
import superjson from 'superjson';
import {endingLink} from './shared';
import omit from 'ramda/es/omit';

export const api = experimental_createTRPCNextAppDirServer<AppRouter>({
  config() {
    return {
      transformer: superjson,
      links: [
        // loggerLink({
        //   enabled: (opts) =>
        //     process.env.NODE_ENV === 'development' ||
        //     (opts.direction === 'down' && opts.result instanceof Error),
        // }),
        endingLink({
          headers: {
            ...omit(
              [
                'Content-Length',
                'content-length',
                'Content-Type',
                'content-type',
                'connection',
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
