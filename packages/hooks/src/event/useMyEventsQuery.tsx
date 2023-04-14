import {trpc} from 'trpc/src/trpc';
import {useMyOrganizationQuery} from '../organization/useMyOrganizationQuery';
import {useSessionQuery} from '../session/useSessionQuery';
import {useMyUserQuery} from '../user/useMyUserQuery';

interface Props {
  eventType: 'attending' | 'organizing' | 'following' | 'all';
  onlyPast: boolean;
}

export function useMyEventsQuery({eventType, onlyPast}: Props) {
  const user = useMyUserQuery();
  const session = useSessionQuery();
  const organization = useMyOrganizationQuery();
  const organizationId = organization.data?.id!;
  const userId = user.data?.id!;
  const id = session.data === 'organization' ? organizationId : userId;

  return trpc.event.getMyEvents.useQuery(
    {
      organizerId: id,
      eventType,
      onlyPast,
    },
    {
      enabled: Boolean(id),
    }
  );
}
