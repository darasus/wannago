import {useOrganization, useOrganizationList} from '@clerk/nextjs';
import {useCallback, useState} from 'react';

export function useToggleSession() {
  const {setActive, organizationList} = useOrganizationList();
  const organization = organizationList?.[0]?.organization;
  const [isTogglingSession, setIsTogglingSession] = useState(false);
  const {organization: activeOrganization} = useOrganization();
  const isOrgSession = Boolean(activeOrganization);

  const toggleSession = useCallback(async () => {
    try {
      setIsTogglingSession(true);
      await setActive?.({
        organization: isOrgSession ? null : organization,
      });
    } catch (error) {
    } finally {
      setIsTogglingSession(false);
    }
  }, [organization, setActive, isOrgSession]);

  return {toggleSession, isTogglingSession};
}
