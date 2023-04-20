// TODO: this can be removed if no events are in the queue

import {NextApiRequest, NextApiResponse} from 'next';
import {verifySignature} from '@upstash/qstash/nextjs';
import {prisma} from 'database/prisma';
import {z} from 'zod';
import {EventReminder} from 'email';
import {render} from '@react-email/render';
import {getBaseUrl} from 'utils';
import {Postmark} from 'lib';
import {formatDate} from 'utils';

const schema = z.object({
  eventId: z.string().uuid(),
});

const postmark = new Postmark();

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const body = schema.parse(req.body);

    const event = await prisma.event.findUnique({
      where: {
        id: body.eventId,
      },
      include: {
        user: true,
        eventSignUps: {
          where: {
            status: 'REGISTERED',
          },
          include: {
            user: true,
          },
        },
      },
    });

    if (!event) {
      throw new Error('Event not found!');
    }

    if (event.isPublished) {
      await Promise.all(
        event.eventSignUps
          .filter(signUp => signUp.status === 'REGISTERED')
          .map(signUp => signUp.user)
          .map(user => {
            const cancelEventUrl = new URL(`${getBaseUrl()}/api/cancel-signup`);
            cancelEventUrl.searchParams.append('eventShortId', event.shortId!);
            cancelEventUrl.searchParams.append('email', user.email);

            return postmark.sendToTransactionalStream({
              replyTo: 'WannaGo Team <hi@wannago.app>',
              to: user.email,
              subject: `Your event is coming up! "${event.title}"!`,
              htmlString: render(
                <EventReminder
                  title={event.title}
                  address={event.address || 'none'}
                  eventUrl={`${getBaseUrl()}/e/${event.shortId}`}
                  cancelEventUrl={cancelEventUrl.toString()}
                  startDate={formatDate(event.startDate, 'MMMM d, yyyy')}
                  endDate={formatDate(event.endDate, 'MMMM d, yyyy')}
                  organizerName={`${event.user?.firstName} ${event.user?.lastName}`}
                />
              ),
            });
          })
      );
    }

    res.send('OK');
  } catch (err) {
    res.status(500).send(err);
  } finally {
    res.end();
  }
}

export default verifySignature(handler);

export const config = {
  api: {
    bodyParser: false,
  },
};
