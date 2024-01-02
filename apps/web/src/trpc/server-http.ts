'use server';

import {experimental_createTRPCNextAppDirServer} from '@trpc/next/app-dir/server';
import {AppRouter} from 'api';
import {headers} from 'next/headers';
import superjson from 'superjson';
import {endingLink} from './shared';
import pick from 'ramda/es/pick';

export const api = experimental_createTRPCNextAppDirServer<AppRouter>({
  config() {
    return {
      transformer: superjson,
      links: [
        endingLink({
          headers: {
            ...pick(
              [
                'cookie',
                'user-agent',
                'cache-control',
                'accept-language',
                'accept-encoding',
                'accept',
              ],
              Object.fromEntries(headers().entries())
            ),
            'x-trpc-source': 'rsc-http',
          },
        }),
      ],
    };
  },
});
