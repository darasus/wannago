import type {HTTPBatchLinkOptions, HTTPHeaders, TRPCLink} from '@trpc/client';
import {httpBatchLink} from '@trpc/client';

import type {AppRouter} from 'api';
import {getBaseUrl} from 'utils';

const lambdas = ['maps', 'subscriptionPlan', 'payments', 'stripeAccountLink'];

export const endingLink = (opts?: {headers?: HTTPHeaders}) =>
  (runtime => {
    const sharedOpts = {
      headers: opts?.headers,
    } satisfies Partial<HTTPBatchLinkOptions>;

    const edgeLink = httpBatchLink({
      ...sharedOpts,
      url: `${getBaseUrl()}/api/trpc/edge`,
    })(runtime);
    const lambdaLink = httpBatchLink({
      ...sharedOpts,
      url: `${getBaseUrl()}/api/trpc/lambda`,
    })(runtime);

    return ctx => {
      const path = ctx.op.path.split('.') as [string, ...string[]];
      const endpoint = lambdas.includes(path[0]) ? 'lambda' : 'edge';

      const newCtx = {
        ...ctx,
        op: {...ctx.op, path: path.join('.')},
      };
      return endpoint === 'edge' ? edgeLink(newCtx) : lambdaLink(newCtx);
    };
  }) satisfies TRPCLink<AppRouter>;
