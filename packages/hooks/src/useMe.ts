import {useAuth} from '@clerk/nextjs';
import {trpc} from 'trpc/src/trpc';

export function useMe() {
  const {isSignedIn} = useAuth();

  return trpc.me.me.useQuery(undefined, {
    enabled: !!isSignedIn,
  });
}
