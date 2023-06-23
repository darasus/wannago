import type {HttpBatchLinkOptions, HTTPHeaders, TRPCLink} from '@trpc/client';
import {httpBatchLink} from '@trpc/client';

import type {AppRouter} from 'api';
import {getBaseUrl} from 'utils';

const lambdas = ['stripe', 'ingestion'];

export const endingLink = (opts?: {headers?: HTTPHeaders}) =>
  (runtime => {
    const sharedOpts = {
      headers: opts?.headers,
    } satisfies Partial<HttpBatchLinkOptions>;

    const edgeLink = httpBatchLink({
      ...sharedOpts,
      url: `${getBaseUrl()}/api/trpc-new/edge`,
    })(runtime);
    const lambdaLink = httpBatchLink({
      ...sharedOpts,
      url: `${getBaseUrl()}/api/trpc-new/lambda`,
    })(runtime);

    return ctx => {
      const path = ctx.op.path.split('.') as [string, ...string[]];
      const endpoint = lambdas.includes(path[0]) ? 'lambda' : 'edge';

      const newCtx = {
        ...ctx,
        op: {...ctx.op, path: path.join('.')},
      };
      // return endpoint === 'edge' ? edgeLink(newCtx) : lambdaLink(newCtx);
      return lambdaLink(newCtx);
    };
  }) satisfies TRPCLink<AppRouter>;
