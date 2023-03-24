import {trpc} from 'trpc/src/trpc';
import {useSessionQuery} from './session/useSessionQuery';
import {useCurrentOrganization} from './useCurrentOrganization';
import {useMyUser} from './user/useMyUser';

interface Props {
  eventType: 'attending' | 'organizing' | 'all';
}

export function useMyEventsQuery({eventType}: Props) {
  const user = useMyUser();
  const session = useSessionQuery();
  const {organization} = useCurrentOrganization();

  return trpc.event.getMyEvents.useQuery(
    {
      id:
        session.data === 'organization'
          ? organization.data?.id!
          : user.data?.id!,
      eventType,
    },
    {
      enabled:
        session.data === 'organization'
          ? Boolean(organization.data?.id)
          : Boolean(user.data?.id),
    }
  );
}
