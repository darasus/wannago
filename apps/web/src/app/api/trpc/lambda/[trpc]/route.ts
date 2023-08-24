import type {NextRequest} from 'next/server';
import {fetchRequestHandler} from '@trpc/server/adapters/fetch';
import {lambdaRouter} from 'api/src/lambda';
import {createContext} from 'api/src/context';
import {captureException} from '@sentry/nextjs';
import {cookies} from 'next/headers';
import {auth} from 'auth';

export const runtime = 'nodejs';

function handler(req: NextRequest) {
  const authRequest = auth.handleRequest({
    request: req,
    cookies: cookies,
  });

  return fetchRequestHandler({
    endpoint: '/api/trpc/lambda',
    router: lambdaRouter,
    req: req,
    createContext: () => createContext({authRequest}),
    onError: ({error, path, req, input, type}) => {
      captureException(error, {
        extra: {
          path,
          req,
          input,
          type,
        },
      });
    },
  });
}

export {handler as GET, handler as POST};
