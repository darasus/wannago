import {prisma} from 'database';
import * as validation from './validation';
import {MailQueue, Telegram} from 'lib';
import {env} from 'server-env';
import {EmailType} from '../../../apps/web/src/types/EmailType';

const mailQueue = new MailQueue();

export const user = {
  created: async (input: validation.Input) => {
    const {data} = validation.user.created.parse(input);

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          {
            externalId: data.id,
          },
          {
            email: {
              in: data.email_addresses.map(e => e.email_address),
            },
          },
        ],
      },
    });

    if (user) {
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          externalId: data.id,
          email: data.email_addresses[0].email_address,
          firstName: data.first_name,
          lastName: data.last_name,
          profileImageSrc: data.profile_image_url,
        },
      });
    } else {
      const user = await prisma.user.create({
        data: {
          externalId: data.id,
          email: data.email_addresses[0].email_address,
          firstName: data.first_name,
          lastName: data.last_name,
          profileImageSrc: data.profile_image_url,
        },
      });

      const telegram = new Telegram();

      if (env.NODE_ENV !== 'development') {
        await telegram
          .sendMessageToWannaGoChannel({
            message: `New user created: ${user.firstName} ${user.lastName} (${user.email})`,
          })
          .catch(console.error);
      }

      await mailQueue.publish({
        body: {
          userId: user.id,
        },
        type: EmailType.AfterRegisterNoCreatedEventFollowUpEmail,
        delay: 60 * 60 * 24 * 2,
      });
    }
  },
  updated: async (input: validation.Input) => {
    const {data} = validation.user.updated.parse(input);
    const user = await prisma.user.findFirst({
      where: {
        externalId: data.id,
      },
    });

    const email = data.email_addresses.find(
      e =>
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
          profileImageSrc: data.profile_image_url,
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
    });

    if (user) {
      const organization = await prisma.organization.findFirst({
        where: {
          id: user.organizationId!,
        },
        include: {
          users: true,
        },
      });

      await prisma.user.delete({
        where: {
          id: user.id,
        },
      });

      if (organization?.users.length === 1) {
        await prisma.organization.delete({
          where: {
            id: organization.id,
          },
        });
      }
    }
  },
};
