import {render} from '@react-email/render';
import {TRPCError} from '@trpc/server';
import {prisma} from 'database';
import {Postmark} from 'lib';
import {getBaseUrl} from 'utils';
import {z} from 'zod';
import {MessageToOrganizer} from 'email';
import {baseEventHandlerSchema} from '../validation/baseEventHandlerSchema';

const postmark = new Postmark();

export const handleMessageToOrganizerInputSchema =
  baseEventHandlerSchema.extend({
    eventId: z.string().uuid(),
    organizerEmail: z.string().email(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    subject: z.string(),
    message: z.string(),
  });

export async function handleMessageToOrganizer({
  email,
  eventId,
  firstName,
  lastName,
  message,
  organizerEmail,
  subject,
}: z.infer<typeof handleMessageToOrganizerInputSchema>) {
  const event = await prisma.event.findUnique({where: {id: eventId}});

  if (!event) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Event not found',
    });
  }

  await postmark.sendTransactionalEmail({
    replyTo: `${firstName} ${lastName} <${email}>`,
    to: organizerEmail,
    subject: 'Someone asked you a question on WannaGo',
    htmlString: render(
      <MessageToOrganizer
        eventTitle={event.title}
        eventUrl={`${getBaseUrl()}/e/${event?.shortId}`}
        message={message}
        subject={subject}
        senderName={`${firstName} ${lastName}`}
        senderEmail={email}
      />
    ),
  });
}
