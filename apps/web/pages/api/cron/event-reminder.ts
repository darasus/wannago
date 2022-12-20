import {NextApiRequest, NextApiResponse} from 'next';
import {verifySignature} from '@upstash/qstash/nextjs';
import {prisma} from '../../../../../packages/database/prisma';
import {z} from 'zod';
import {Mailgun} from '../../../lib/mailgun';

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

    const mail = new Mailgun();

    if (event.isPublished) {
      await mail.sendEventReminderEmail({
        event,
        users: event.attendees,
      });
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
