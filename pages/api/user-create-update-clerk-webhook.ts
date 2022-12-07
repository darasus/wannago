import {NextApiRequest, NextApiResponse} from 'next';
import {z} from 'zod';
import {prisma} from '../../lib/prisma';

const scheme = z.object({
  type: z.enum(['user.created', 'user.updated', 'user.deleted']),
  data: z.object({
    id: z.string(),
    first_name: z.string(),
    last_name: z.string(),
    profile_image_url: z.string(),
    email_addresses: z.array(
      z.object({
        email_address: z.string(),
      })
    ),
  }),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(405).json({error: 'Method Not Allowed'});
  }

  const {data, type} = scheme.parse(req.body);

  if (type === 'user.created') {
    await prisma.user.create({
      data: {
        externalId: data.id,
        email: data.email_addresses[0].email_address,
        firstName: data.first_name,
        lastName: data.last_name,
        profileImageSrc: data.profile_image_url,
        organization: {
          create: {},
        },
      },
    });
  }

  if (type === 'user.updated') {
    const user = await prisma.user.findFirst({
      where: {
        externalId: data.id,
      },
    });
    if (user) {
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          email: data.email_addresses[0].email_address,
          firstName: data.first_name,
          lastName: data.last_name,
          profileImageSrc: data.profile_image_url,
        },
      });
    }
  }

  return res.status(200).json({success: true});
}
