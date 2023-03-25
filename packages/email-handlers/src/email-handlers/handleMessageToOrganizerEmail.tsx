import {render} from '@react-email/render';
import {TRPCError} from '@trpc/server';
import {prisma} from 'database';
import {Postmark} from 'lib';
import {getBaseUrl} from 'utils';
import {z} from 'zod';
import {MessageToOrganizer} from 'email';
import {baseEventHandlerSchema} from '../validation/baseEventHandlerSchema';

const postmark = new Postmark();

export const handleMessageToOrganizerEmailInputSchema =
  baseEventHandlerSchema.extend({
    eventId: z.string().uuid(),
    organizerName: z.string(),
    organizerEmail: z.string().email(),
    email: z.string().email(),
    subject: z.string(),
    message: z.string(),
  });

export async function handleMessageToOrganizerEmail({
  email,
  eventId,
  message,
  organizerName,
  organizerEmail,
  subject,
}: z.infer<typeof handleMessageToOrganizerEmailInputSchema>) {
  const event = await prisma.event.findUnique({where: {id: eventId}});

  if (!event) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Event not found',
    });
  }

  await postmark.sendToTransactionalStream({
    replyTo: `${organizerName} <${email}>`,
    to: organizerEmail,
    subject: 'Someone asked you a question on WannaGo',
    htmlString: render(
      <MessageToOrganizer
        eventTitle={event.title}
        eventUrl={`${getBaseUrl()}/e/${event?.shortId}`}
        message={message}
        subject={subject}
        senderName={organizerName}
        senderEmail={email}
      />
    ),
  });
}
