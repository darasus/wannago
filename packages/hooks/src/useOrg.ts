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
  const [isOrg, setIsOrg] = useState(false);
  const [members, setMembers] = useState<OrganizationMembershipResource[]>([]);
  const [invitations, setInvitations] = useState<
    OrganizationInvitationResource[]
  >([]);
  const {organization: org} = useOrganization();
  const {organizationList} = useOrganizationList();
  const {createOrganization} = useOrganizations();
  const isTeamSession = Boolean(org);
  const organization = organizationList?.[0]?.organization;
  const hasTeam = Boolean(organization);

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
    },
    [createOrganization]
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
    addMember,
    members,
    invitations,
    isTeamSession,
    hasTeam,
  };
}
