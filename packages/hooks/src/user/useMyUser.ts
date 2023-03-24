import {useAuth} from '@clerk/nextjs';
import {trpc} from 'trpc/src/trpc';

export const useMyUser = () => {
  const auth = useAuth();

  return trpc.user.me.useQuery(undefined, {
    enabled: !!auth.isSignedIn,
  });
};
