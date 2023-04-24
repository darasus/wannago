import {useMyOrganizationQuery} from './organization/useMyOrganizationQuery';
import {useSessionQuery} from './session/useSessionQuery';
import {useMyUserQuery} from './user/useMyUserQuery';

export function useAuthorId() {
  const me = useMyUserQuery();
  const organization = useMyOrganizationQuery();
  const session = useSessionQuery();

  if (session.data === 'organization') {
    return organization.data?.id;
  }

  return me.data?.id;
}
