import {NextApiRequest, NextApiResponse} from 'next';
import {verifySignature} from '@upstash/qstash/nextjs';
import {prisma} from '../../../lib/prisma';
import {z} from 'zod';
import {Mail} from '../../../lib/mail';
import {differenceInSeconds} from 'date-fns';
import {REMINDER_PERIOD_IN_SECONDS} from '../../../constants';

const schema = z.object({
  eventId: z.string().uuid(),
});

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const body = schema.parse(req.body);

    const event = await prisma.event.findUnique({
      where: {
        id: body.eventId,
      },
      include: {
        attendees: true,
      },
    });

    if (!event) {
      throw new Error('Event not found!');
    }

    const mail = new Mail();

    await mail.sendEventReminderEmail({
      event,
      users: event.attendees,
    });

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
