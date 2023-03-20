import {useAuth, useUser} from '@clerk/nextjs';
import {trpc} from 'trpc/src/trpc';

export function useMe() {
  const auth = useAuth();
  const {user} = useUser();
  const {isSignedIn} = auth;

  const {data} = trpc.user.me.useQuery(undefined, {
    enabled: !!isSignedIn,
  });

  const me = data || null;

  return {me, auth, clerkMe: user};
}
