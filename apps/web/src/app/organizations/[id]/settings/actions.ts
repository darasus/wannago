'use server';

import {Currency} from '@prisma/client';
import {api} from '../../../../trpc/server-http';

export async function updateOrganization(args: {
  organizationId: string;
  name: string;
  logoSrc: string;
  email: string;
  currency: Currency;
}) {
  const response = await api.organization.update.mutate(args);
  await api.organization.getOrganizationById.revalidate();
  await api.organization.getMyOrganizations.revalidate();

  return response;
}
