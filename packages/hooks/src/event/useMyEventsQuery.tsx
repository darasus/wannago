import {trpc} from 'trpc/src/trpc';
import {useMyUserQuery} from '../user/useMyUserQuery';

interface Props {
  eventType: 'attending' | 'organizing' | 'following' | 'all';
  onlyPast: boolean;
}

export function useMyEventsQuery({eventType, onlyPast}: Props) {
  const user = useMyUserQuery();
  const userId = user.data?.id!;

  return trpc.event.getMyEvents.useQuery(
    {
      eventType,
      onlyPast,
    },
    {
      enabled: Boolean(userId),
      refetchOnMount: 'always',
    }
  );
}
