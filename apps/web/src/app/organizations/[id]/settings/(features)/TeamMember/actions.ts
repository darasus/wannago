'use server';

import {api} from '../../../../../../trpc/server-http';

export async function removeMember({
  userId,
  organizationId,
}: {
  userId: string;
  organizationId: string;
}) {
  await api.organization.removeOrganizationMember.mutate({
    userId,
    organizationId,
  });

  await api.organization.getMyOrganizationMembers.revalidate();
}
