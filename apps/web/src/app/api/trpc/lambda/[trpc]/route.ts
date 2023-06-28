import type {NextRequest} from 'next/server';
import {fetchRequestHandler} from '@trpc/server/adapters/fetch';
import {lambdaRouter} from 'api/src/lambda';
import {createContext} from 'api/src/context';

export const runtime = 'nodejs';

const handler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: '/api/trpc/lambda',
    router: lambdaRouter,
    req: req,
    createContext: () => createContext({req}),
    onError: ({error}) => {
      console.log('Error in tRPC handler (lambda)');
      console.error(error);
    },
  });

export {handler as GET, handler as POST};
