import {NextApiRequest, NextApiResponse} from 'next';
import {Mailgun} from '../../../lib/mailgun';
import {z} from 'zod';
import {prisma} from 'database/prisma';
import {TRPCError} from '@trpc/server';

const mailgun = new Mailgun();

const scheme = z.object({
  eventId: z.string().uuid(),
  organizerUserId: z.string().uuid(),
  subject: z.string(),
  message: z.string(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(405).json({error: 'Method Not Allowed'});
  }

  const body = scheme.parse(JSON.parse(req.body));

  const event = await prisma.event.findUnique({where: {id: body.eventId}});
  const organizerUser = await prisma.user.findUnique({
    where: {id: body.organizerUserId},
  });
  const signUps = await prisma.eventSignUp.findMany({
    where: {
      eventId: body.eventId,
    },
    include: {
      user: true,
    },
  });

  if (!event || !organizerUser) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Event or user not found',
    });
  }

  await mailgun.sendMessageToEventParticipants({
    event,
    organizerUser,
    subject: body.subject,
    message: body.message,
    users: signUps.map(signUp => signUp.user),
  });

  res.status(200).json({success: true});
}
