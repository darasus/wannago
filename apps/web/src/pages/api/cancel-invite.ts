import {prisma} from 'database';
import {NextApiRequest, NextApiResponse} from 'next';
import {z} from 'zod';
import {MailQueue} from 'lib';
import {getBaseUrl} from 'utils';
import {EmailType} from 'types';
import {handleEventCancelInviteEmailInputSchema} from 'email-input-validation';

const mailQueue = new MailQueue();

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
    include: {
      user: true,
      event: {
        include: {
          user: true,
        },
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
      status: 'CANCELLED',
    },
  });

  if (eventSignUp?.user) {
    await mailQueue.addMessage({
      body: {
        eventId: eventSignUp.event.id,
        userId: eventSignUp.user.id,
        type: EmailType.EventCancelInvite,
      } satisfies z.infer<typeof handleEventCancelInviteEmailInputSchema>,
    });
  }

  const url = new URL(`${getBaseUrl()}//e/${params.eventShortId}`);
  url.searchParams.append('cancelInvite', 'true');

  return res.redirect(url.toString());
}
