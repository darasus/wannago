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
import {trpc} from 'trpc/src/trpc';

export function useCurrentOrganization() {
  const [members, setMembers] = useState<OrganizationMembershipResource[]>([]);
  const [invitations, setInvitations] = useState<
    OrganizationInvitationResource[]
  >([]);
  const {organization: org} = useOrganization();
  const {organizationList} = useOrganizationList();
  const {createOrganization} = useOrganizations();
  const isOrganizationSession = Boolean(org);
  const clerkOrganization = organizationList?.[0]?.organization;
  const hasTeam = Boolean(clerkOrganization);
  const organization = trpc.organization.getOrganizationByExternalId.useQuery(
    {
      externalId: clerkOrganization?.id!,
    },
    {
      enabled: Boolean(clerkOrganization?.id),
    }
  );

  useEffect(() => {
    clerkOrganization?.getMemberships().then(res => {
      setMembers(res);
    });
    clerkOrganization?.getPendingInvitations().then(res => {
      setInvitations(res);
    });
  }, [clerkOrganization]);

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
      await clerkOrganization?.destroy();
    } catch (error: any) {
      if (error.errors?.length > 0) {
        error.errors?.forEach((e: any) => {
          toast.error(e?.longMessage || 'Something went wrong');
        });
      } else {
        toast.error('Something went wrong');
      }
    }
  }, [clerkOrganization]);

  const addMember = useCallback(
    ({email, role}: {email: string; role: MembershipRole}) => {
      clerkOrganization?.inviteMember({
        role,
        emailAddress: email,
      });
    },
    [clerkOrganization]
  );

  return {
    organization,
    clerkOrganization,
    createOrg,
    removeOrg,
    addMember,
    members,
    invitations,
    isOrganizationSession,
    hasTeam,
  };
}
