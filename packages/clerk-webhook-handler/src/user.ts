import {prisma} from 'database';
import * as validation from './validation';
import {inngest} from 'inngest-client';

export const user = {
  created: async (input: validation.Input) => {
    const {data} = validation.user.created.parse(input);
    let userId: string | null = null;

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          {
            externalId: data.id,
          },
          {
            email: {
              in: data.email_addresses.map((e) => e.email_address),
            },
          },
        ],
      },
    });

    if (user) {
      userId = user.id;

      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          externalId: data.id,
          email: data.email_addresses[0].email_address,
          firstName: data.first_name,
          lastName: data.last_name,
        },
      });
    } else {
      const user = await prisma.user.create({
        data: {
          externalId: data.id,
          email: data.email_addresses[0].email_address,
          firstName: data.first_name,
          lastName: data.last_name,
          preferredCurrency: 'USD',
        },
      });

      userId = user.id;

      await inngest.send({
        name: 'email/after.register.no.created.event.follow.up.email',
        data: {
          userId: user.id,
        },
      });
    }

    await inngest.send({
      name: 'user/account.registered',
      data: {userId},
    });
  },
  updated: async (input: validation.Input) => {
    const {data} = validation.user.updated.parse(input);
    const user = await prisma.user.findFirst({
      where: {
        externalId: data.id,
      },
    });

    const email = data.email_addresses.find(
      (e) =>
        e.verification?.status === 'verified' &&
        e.id === data.primary_email_address_id
    );

    if (user) {
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          email: email?.email_address,
          firstName: data.first_name,
          lastName: data.last_name,
        },
      });
    }
  },
  deleted: async (input: validation.Input) => {
    const {data} = validation.user.deleted.parse(input);
    const user = await prisma.user.findFirst({
      where: {
        externalId: data.id,
      },
      include: {
        organizations: true,
      },
    });

    if (user) {
      await prisma.user.delete({
        where: {
          id: user.id,
        },
      });

      if (user.organizations.length > 0) {
        await prisma.organization.deleteMany({
          where: {
            id: {
              in: user.organizations.map((o) => o.id),
            },
          },
        });
      }
    }
  },
};
