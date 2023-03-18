import {NextApiRequest, NextApiResponse} from 'next';
import {env} from 'server-env';
import {z} from 'zod';
import {prisma} from 'database';
import {MailQueue, Telegram} from 'lib';

const scheme = z.object({
  type: z.enum(['user.created', 'user.updated', 'user.deleted']),
  data: z.object({
    id: z.string(),
    first_name: z.string(),
    last_name: z.string(),
    profile_image_url: z.string(),
    primary_email_address_id: z.string(),
    email_addresses: z.array(
      z.object({
        id: z.string(),
        email_address: z.string(),
        verification: z
          .object({
            status: z.enum(['verified']),
          })
          .nullable(),
      })
    ),
  }),
});

const mailQueue = new MailQueue();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(405).json({error: 'Method Not Allowed'});
  }

  const {data, type} = scheme.parse(req.body);

  if (type === 'user.created') {
    const organization = await prisma.organization.create({
      data: {},
    });

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
          organization: {
            connect: {
              id: organization.id,
            },
          },
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
          organization: {
            connect: {
              id: organization.id,
            },
          },
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

      await mailQueue.enqueueAfterRegisterNoCreatedEventFollowUpEmail({
        userId: user.id,
      });
    }
  }

  if (type === 'user.updated') {
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
  }

  return res.status(200).json({success: true});
}
