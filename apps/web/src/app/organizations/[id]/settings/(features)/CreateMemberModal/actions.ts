'use server';

import {api} from '../../../../../../trpc/server-http';

export async function addMember({
  email,
  organizationId,
}: {
  email: string;
  organizationId: string;
}) {
  await api.organization.addOrganizationMember.mutate({
    userEmail: email,
    organizationId,
  });

  await api.organization.getMyOrganizationMembers.revalidate();
}
