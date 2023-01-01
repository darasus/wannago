import {appRouter} from '../../../server/routers/_app';
import {createContext} from '../../../server/context';
import {NextRequest} from 'next/server';
import {fetchRequestHandler} from '@trpc/server/adapters/fetch';

export const config = {
  runtime: 'experimental-edge',
  regions: ['fra1'],
};

export default async function handler(req: NextRequest) {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    router: appRouter,
    req,
    createContext,
    onError({error}) {
      if (error.code === 'INTERNAL_SERVER_ERROR') {
        console.error('Something went wrong', error);
      }
    },
  });
}
