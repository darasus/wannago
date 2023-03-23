import {trpc} from 'trpc/src/trpc';
import {useCurrentOrganization} from './useCurrentOrganization';
import {useMe} from './useMe';

interface Props {
  eventType: 'attending' | 'organizing' | 'all';
}

export function useMyEventsQuery({eventType}: Props) {
  const {me, isPersonalSession} = useMe();
  const {organization} = useCurrentOrganization();

  return trpc.event.getMyEvents.useQuery(
    {
      id: isPersonalSession ? me?.id! : organization.data?.id!,
      eventType,
    },
    {
      enabled: isPersonalSession
        ? Boolean(me?.id)
        : Boolean(organization.data?.id),
    }
  );
}
