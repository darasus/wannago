import {useMyOrganizationQuery} from './organization/useMyOrganizationQuery';
import {useSessionQuery} from './session/useSessionQuery';
import {useMyUserQuery} from './user/useMyUserQuery';

export function useCurrentAuthorId() {
  const user = useMyUserQuery();
  const organization = useMyOrganizationQuery();
  const session = useSessionQuery();

  return {
    authorId:
      session.data === 'organization' ? organization?.data?.id : user.data?.id,
  };
}
