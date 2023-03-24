import {useSessionQuery} from './session/useSessionQuery';
import {useCurrentOrganization} from './useCurrentOrganization';
import {useMyUserQuery} from './user/useMyUserQuery';

export function useCurrentAuthorId() {
  const user = useMyUserQuery();
  const session = useSessionQuery();
  const {organization} = useCurrentOrganization();

  return {
    authorId:
      session.data === 'organization' ? organization?.data?.id : user.data?.id,
  };
}
