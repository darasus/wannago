import {useOrganizationList} from '@clerk/nextjs';
import {useCallback, useState} from 'react';

export function useToggleSession() {
  const [isOrg, setIsOrg] = useState(false);
  const {setActive, organizationList} = useOrganizationList();
  const organization = organizationList?.[0]?.organization;
  const [isTogglingSession, setIsTogglingSession] = useState(false);

  const toggleSession = useCallback(async () => {
    try {
      setIsTogglingSession(true);
      await setActive?.({
        organization: isOrg ? null : organization,
      });
      setIsOrg(!isOrg);
    } catch (error) {
    } finally {
      setIsTogglingSession(false);
    }
  }, [isOrg, organization, setActive]);

  return {toggleSession, isTogglingSession};
}
