import type {NextRequest} from 'next/server';
import {fetchRequestHandler} from '@trpc/server/adapters/fetch';
import {router} from 'api/src/router';
import {createContext} from 'api/src/context';

const handler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    router,
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
