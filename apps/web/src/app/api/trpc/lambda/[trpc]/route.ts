import type {NextRequest} from 'next/server';
import {fetchRequestHandler} from '@trpc/server/adapters/fetch';
import {lambdaRouter} from 'api/src/lambda';
import {createContext} from 'api/src/context';

const handler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: '/api/trpc/lambda',
    router: lambdaRouter,
    req: req,
    createContext,
    onError: ({error, path, req, input, type}) => {
      console.error(error, {
        extra: {
          path,
          req,
          input,
          type,
        },
      });
    },
  });

export {handler as GET, handler as POST};
