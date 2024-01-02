import type {HTTPBatchLinkOptions, HTTPHeaders, TRPCLink} from '@trpc/client';
import {experimental_nextHttpLink} from '@trpc/next/app-dir/links/nextHttp';

import type {AppRouter} from 'api';
import {getBaseUrl} from 'utils';

export const endingLink = (opts?: {headers?: HTTPHeaders}) =>
  ((runtime) => {
    const sharedOpts = {
      headers: opts?.headers,
      batch: true,
      revalidate: 0,
    } satisfies Partial<
      HTTPBatchLinkOptions & {
        batch?: boolean;
        revalidate?: number | false;
      }
    >;

    const link = experimental_nextHttpLink({
      ...sharedOpts,
      url: `${getBaseUrl()}/api/trpc`,
    })(runtime);

    return (ctx) => {
      const path = ctx.op.path.split('.') as [string, ...string[]];

      const newCtx = {
        ...ctx,
        op: {...ctx.op, path: path.join('.')},
      };
      return link(newCtx);
    };
  }) satisfies TRPCLink<AppRouter>;
