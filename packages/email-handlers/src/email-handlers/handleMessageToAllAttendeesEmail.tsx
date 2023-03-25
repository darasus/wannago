import {render} from '@react-email/render';
import {TRPCError} from '@trpc/server';
import {prisma} from 'database';
import {Postmark} from 'lib';
import {getBaseUrl, isUser} from 'utils';
import {z} from 'zod';
import {MessageToAttendees} from 'email';
import {baseEventHandlerSchema} from '../validation/baseEventHandlerSchema';

const postmark = new Postmark();

export const handleMessageToAllAttendeesEmailInputSchema =
  baseEventHandlerSchema.extend({
    subject: z.string(),
    message: z.string(),
    eventId: z.string().uuid(),
    organizerUserId: z.string().uuid(),
  });

export async function handleMessageToAllAttendeesEmail({
  eventId,
  message,
  organizerUserId,
  subject,
}: z.infer<typeof handleMessageToAllAttendeesEmailInputSchema>) {
  const event = await prisma.event.findFirst({
    where: {
      id: eventId,
    },
    include: {
      user: true,
      organization: true,
    },
  });

  if (!event) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Event not found',
    });
  }

  const organizer = event.user || event.organization;

  if (!organizer) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Organizer not found',
    });
  }

  const signUps = await prisma.eventSignUp.findMany({
    where: {
      eventId: eventId,
      status: 'REGISTERED',
    },
    include: {
      user: true,
    },
  });

  if (!event) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Event not found',
    });
  }

  const name = isUser(organizer)
    ? `${organizer.firstName} ${organizer.lastName}`
    : organizer.name;

  await Promise.all(
    signUps
      .map(signUp => signUp.user)
      .map(async user => {
        const messageData = {
          replyTo: `${name} <${organizer.email}>`,
          to: user.email,
          subject: `Message from event organizer: "${event.title}"`,
          htmlString: render(
            <MessageToAttendees
              eventUrl={`${getBaseUrl()}/e/${event?.shortId}`}
              message={message}
              eventTitle={event.title}
              subject={subject}
            />
          ),
        };

        await postmark.sendToTransactionalStream(messageData);
      })
  );
}
