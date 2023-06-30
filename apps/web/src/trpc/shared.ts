import type {HTTPBatchLinkOptions, HTTPHeaders, TRPCLink} from '@trpc/client';
import {experimental_nextHttpLink} from '@trpc/next/app-dir/links/nextHttp';

import type {AppRouter} from 'api';
import {getBaseUrl} from 'utils';

const lambdas = ['subscriptionPlan', 'payments', 'stripeAccountLink'];

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

    const edgeLink = experimental_nextHttpLink({
      ...sharedOpts,
      url: `${getBaseUrl()}/api/trpc/edge`,
      fetch: (input, init) => fetch(input, {...init, cache: 'no-store'}),
    })(runtime);

    const lambdaLink = experimental_nextHttpLink({
      ...sharedOpts,
      url: `${getBaseUrl()}/api/trpc/lambda`,
      fetch: (input, init) => fetch(input, {...init, cache: 'no-store'}),
    })(runtime);

    return (ctx) => {
      const path = ctx.op.path.split('.') as [string, ...string[]];
      const endpoint = lambdas.includes(path[0]) ? 'lambda' : 'edge';

      const newCtx = {
        ...ctx,
        op: {...ctx.op, path: path.join('.')},
      };
      return endpoint === 'edge' ? edgeLink(newCtx) : lambdaLink(newCtx);
    };
  }) satisfies TRPCLink<AppRouter>;

// batch: true,
// url: '', // URL is fixed in endingLink
// revalidate: 0,
// headers() {
// return {
// ...Object.fromEntries(headers().entries()),
// cookie: cookies().toString(),
// 'x-trpc-source': 'rsc-http',
// };
// },
