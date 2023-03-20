import {useAuth} from '@clerk/nextjs';
import {trpc} from 'trpc/src/trpc';

export function useMe() {
  const auth = useAuth();
  const {userId, isSignedIn} = auth;

  const {data} = trpc.me.me.useQuery(undefined, {
    enabled: !!isSignedIn,
  });

  const me = data || null;

  return {me, auth};
}
