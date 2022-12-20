import {NextApiRequest, NextApiResponse} from 'next';
import fs from 'fs';
import FormData from 'form-data';
import formidable from 'formidable';
import got from 'got';
import {Mailgun} from '../../../lib/mailgun';
import {z} from 'zod';
import {prisma} from 'database/prisma';
import {TRPCError} from '@trpc/server';

const mailgun = new Mailgun();

const scheme = z.object({
  eventId: z.string().uuid(),
  userId: z.string().uuid(),
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
  const user = await prisma.user.findUnique({where: {id: body.userId}});

  if (!event || !user) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Event or user not found',
    });
  }

  await mailgun.sendEventSignupEmail({
    event,
    user,
  });

  res.status(200).json({success: true});
}
