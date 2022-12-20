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
  organizerEmail: z.string().email(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
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

  if (!event) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Event not found',
    });
  }

  await mailgun.sendQuestionToOrganizer({
    event,
    email: body.email,
    firstName: body.firstName,
    lastName: body.lastName,
    subject: body.subject,
    message: body.message,
    organizerEmail: body.organizerEmail,
  });

  res.status(200).json({success: true});
}
