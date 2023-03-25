import {useMyOrganizationQuery} from '../organization/useMyOrganizationQuery';
import {useMyUserQuery} from '../user/useMyUserQuery';
import {useEventQuery} from './useEventQuery';

export function useIsMyEvent({eventShortId}: {eventShortId: string | null}) {
  const user = useMyUserQuery();
  const organization = useMyOrganizationQuery();
  const event = useEventQuery({eventShortId});

  if (!user.data?.id && !organization.data?.id) {
    return false;
  }

  const isMyEvent =
    event.data?.userId === user.data?.id ||
    event.data?.organizationId === organization.data?.id;

  return isMyEvent;
}
