import * as validation from './validation';
import {prisma} from 'database';
import {TRPCError} from '@trpc/server';

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

    if (!user) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'User not found',
      });
    }

    await prisma.organization.update({
      where: {
        id: user.organization.id,
      },
      data: {
        name: data.name,
        logoSrc: data.logo_url,
        isActive: true,
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

    if (!user) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'User not found',
      });
    }

    await prisma.organization.update({
      where: {
        id: user.organization.id,
      },
      data: {
        name: data.name,
        logoSrc: data.logo_url,
        isActive: true,
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

    if (!organization) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Organization not found',
      });
    }

    await prisma.organization.update({
      where: {
        id: organization.id,
      },
      data: {
        name: null,
        logoSrc: null,
        isActive: false,
        externalId: null,
      },
    });
  },
};
