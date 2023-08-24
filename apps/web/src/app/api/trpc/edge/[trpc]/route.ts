import type {NextRequest} from 'next/server';
import {fetchRequestHandler} from '@trpc/server/adapters/fetch';
import {edgeRouter} from 'api/src/edge';
import {createContext} from 'api/src/context';
import {captureException} from '@sentry/nextjs';
import {auth} from 'auth';
import {cookies} from 'next/headers';

export const runtime = 'edge';
export const preferredRegion = ['iad1'];

function handler(req: NextRequest) {
  const authRequest = auth.handleRequest({
    request: req,
    cookies: cookies,
  });

  return fetchRequestHandler({
    endpoint: '/api/trpc/edge',
    router: edgeRouter,
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
