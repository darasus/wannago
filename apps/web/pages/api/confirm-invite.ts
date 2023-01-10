import {prisma} from 'database';
import {NextApiRequest, NextApiResponse} from 'next';
import {z} from 'zod';

const scheme = z.object({
  eventShortId: z.string(),
  email: z.string(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.status(405).json({error: 'Method Not Allowed'});
  }

  const params = scheme.parse(req.query);

  const eventSignUp = await prisma.eventSignUp.findFirst({
    where: {
      event: {
        shortId: params.eventShortId,
      },
      user: {
        email: params.email,
      },
    },
  });

  if (!eventSignUp) {
    return res.status(404).json({error: 'Event sign up not found'});
  }

  await prisma.eventSignUp.update({
    where: {
      id: eventSignUp.id,
    },
    data: {
      status: 'REGISTERED',
    },
  });

  res.redirect(`/e/${params.eventShortId}?inviteConfirmed=true`);
}
