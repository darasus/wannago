import {NextApiRequest, NextApiResponse} from 'next';
import {z} from 'zod';
import {prisma} from '../../../../../packages/database/prisma';

const scheme = z.object({
  type: z.enum(['user.deleted']),
  data: z.object({
    id: z.string(),
    deleted: z.boolean(),
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

  if (type === 'user.deleted') {
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
  }

  return res.status(200).json({success: true});
}
