import type {NextRequest} from 'next/server';
import {fetchRequestHandler} from '@trpc/server/adapters/fetch';

import {lambdaRouter} from 'api/src/lambda';
import {createContext} from 'api/src/context';

// Stripe is incompatible with Edge runtimes due to using Node.js events
// export const runtime = "edge";

const handler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: '/api/trpc-new/lambda',
    router: lambdaRouter,
    req: req,
    createContext: async () => createContext({req}),
    onError: ({error}) => {
      console.log('Error in tRPC handler (lambda)');
      console.error(error);
    },
  });

export {handler as GET, handler as POST};
