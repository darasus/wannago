import {useSessionQuery} from './session/useSessionQuery';
import {useCurrentOrganization} from './useCurrentOrganization';
import {useMyUser} from './user/useMyUser';

export function useCurrentAuthorId() {
  const user = useMyUser();
  const session = useSessionQuery();
  const {organization} = useCurrentOrganization();

  return {
    authorId:
      session.data === 'organization' ? organization?.data?.id : user.data?.id,
  };
}
