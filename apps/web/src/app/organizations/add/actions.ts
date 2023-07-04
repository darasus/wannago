'use server';

import {Currency} from '@prisma/client';
import {api} from '../../../trpc/server-http';

export async function createOrganization(args: {
  name: string;
  logoSrc: string;
  email: string;
  currency: Currency;
}) {
  const response = await api.organization.create.mutate(args);
  await api.organization.getMyOrganizations.revalidate();

  return response;
}
