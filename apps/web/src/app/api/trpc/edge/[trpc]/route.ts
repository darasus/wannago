import type {NextRequest} from 'next/server';
import {fetchRequestHandler} from '@trpc/server/adapters/fetch';
import {edgeRouter} from 'api/src/edge';
import {createContext} from 'api/src/context';
import {captureException} from '@sentry/nextjs';

export const runtime = 'edge';
export const preferredRegion = ['iad1'];

const handler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: '/api/trpc/edge',
    router: edgeRouter,
    req: req,
    createContext: () => createContext({req}),
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

export {handler as GET, handler as POST};
