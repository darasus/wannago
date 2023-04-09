import {useAuth} from '@clerk/nextjs';
import {trpc} from 'trpc/src/trpc';

export function useIsMyEvent({eventShortId}: {eventShortId: string | null}) {
  const auth = useAuth();

  return trpc.event.getIsMyEvent.useQuery(
    {eventShortId: eventShortId!},
    {enabled: !!eventShortId && auth.isSignedIn}
  );
}
