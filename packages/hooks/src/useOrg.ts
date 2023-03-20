import {
  useOrganization,
  useOrganizationList,
  useOrganizations,
} from '@clerk/nextjs';
import {
  MembershipRole,
  OrganizationInvitationResource,
  OrganizationMembershipResource,
} from '@clerk/types';
import {useCallback, useEffect, useState} from 'react';
import {toast} from 'react-hot-toast';

export function useOrg() {
  const [members, setMembers] = useState<OrganizationMembershipResource[]>([]);
  const [invitations, setInvitations] = useState<
    OrganizationInvitationResource[]
  >([]);
  const {organization} = useOrganization({
    invitationList: {
      limit: 100,
      offset: 0,
    },
    membershipList: {
      limit: 100,
      offset: 0,
    },
  });
  const {createOrganization} = useOrganizations();
  const {setActive} = useOrganizationList();

  useEffect(() => {
    organization?.getMemberships().then(res => {
      setMembers(res);
    });
    organization?.getPendingInvitations().then(res => {
      setInvitations(res);
    });
  }, [organization]);

  const createOrg = useCallback(
    async ({name, file}: {name: string; file: File}) => {
      const result = await createOrganization?.({
        name,
      });
      await result?.setLogo?.({
        file,
      });
      await setActive?.({
        organization: result?.id,
      });
    },
    [createOrganization, setActive]
  );

  const removeOrg = useCallback(async () => {
    try {
      await organization?.destroy();
    } catch (error: any) {
      if (error.errors?.length > 0) {
        error.errors?.forEach((e: any) => {
          toast.error(e?.longMessage || 'Something went wrong');
        });
      } else {
        toast.error('Something went wrong');
      }
    }
  }, [organization]);

  const addMember = useCallback(
    ({email, role}: {email: string; role: MembershipRole}) => {
      organization?.inviteMember({
        role,
        emailAddress: email,
      });
    },
    [organization]
  );

  return {
    org: organization,
    createOrg,
    removeOrg,
    members,
    addMember,
    invitations,
  };
}
