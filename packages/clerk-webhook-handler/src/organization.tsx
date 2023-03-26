import * as validation from './validation';
import {prisma} from 'database';
import {TRPCError} from '@trpc/server';
import {invariant} from 'utils';
import {organizationNotFoundError, userNotFoundError} from 'error';

export const organization = {
  created: async (input: validation.Input) => {
    const {data} = validation.organization.created.parse(input);

    const user = await prisma.user.findFirst({
      where: {
        externalId: data.created_by,
      },
      include: {
        organization: true,
      },
    });

    invariant(user, userNotFoundError);

    await prisma.organization.update({
      where: {
        id: user.organization?.id,
      },
      data: {
        name: data.name,
        logoSrc: data.logo_url,
        externalId: data.id,
      },
    });
  },
  updated: async (input: validation.Input) => {
    const {data} = validation.organization.updated.parse(input);

    const user = await prisma.user.findFirst({
      where: {
        externalId: data.created_by,
      },
      include: {
        organization: true,
      },
    });

    invariant(user, userNotFoundError);

    await prisma.organization.update({
      where: {
        id: user.organization?.id,
      },
      data: {
        name: data.name,
        logoSrc: data.logo_url,
        externalId: data.id,
      },
    });
  },
  deleted: async (input: validation.Input) => {
    const {data} = validation.organization.deleted.parse(input);

    const organization = await prisma.organization.findFirst({
      where: {
        externalId: data.id,
      },
    });

    invariant(organization, organizationNotFoundError);

    await prisma.organization.update({
      where: {
        id: organization.id,
      },
      data: {
        name: null,
        logoSrc: null,
        externalId: null,
      },
    });
  },
};
