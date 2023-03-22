import {useCurrentOrganization} from './useCurrentOrganization';
import {useMe} from './useMe';

export function useCurrentAuthorId() {
  const {isPersonalSession, me} = useMe();
  const {organization} = useCurrentOrganization();

  return {authorId: isPersonalSession ? me?.id : organization?.data?.id};
}
