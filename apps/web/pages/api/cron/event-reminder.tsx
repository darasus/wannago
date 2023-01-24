import {NextApiRequest, NextApiResponse} from 'next';
import {verifySignature} from '@upstash/qstash/nextjs';
import {prisma} from 'database/prisma';
import {z} from 'zod';
import {EventReminder} from 'email';
import {render} from '@react-email/render';
import {getBaseUrl} from '../../../utils/getBaseUrl';
import {Postmark} from '../../../lib/portmark';

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
            return postmark.sendTransactionalEmail({
              replyTo: 'WannaGo Team <hi@wannago.app>',
              to: user.email,
              subject: `Your event is coming up! "${event.title}"!`,
              htmlString: render(
                <EventReminder
                  title={event.title}
                  address={event.address}
                  eventUrl={`${getBaseUrl()}/e/${event.shortId}`}
                  startDate="In few hours"
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
