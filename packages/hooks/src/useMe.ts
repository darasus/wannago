import {
  useAuth,
  useOrganization,
  useOrganizationList,
  useUser,
} from '@clerk/nextjs';
import {trpc} from 'trpc/src/trpc';

export function useMe() {
  const auth = useAuth();
  const {user} = useUser();
  const {isSignedIn} = auth;
  const {organization} = useOrganization();
  const isPersonalSession = !organization;

  const {data} = trpc.user.me.useQuery(undefined, {
    enabled: !!isSignedIn,
  });

  const me = data || null;

  return {me, auth, clerkMe: user, isPersonalSession};
}
