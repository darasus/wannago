import {trpc} from 'trpc/src/trpc';

export function useSessionQuery() {
  return trpc.session.getSession.useQuery();
}
