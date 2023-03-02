import {render} from '@react-email/render';
import {TRPCError} from '@trpc/server';
import {prisma} from 'database';
import {Postmark} from 'lib';
import {getBaseUrl} from 'utils';
import {z} from 'zod';
import {MessageToAttendees} from 'email';
import {baseEventHandlerSchema} from '../validation/baseEventHandlerSchema';

const postmark = new Postmark();

export const handleMessageToAllAttendeesInputSchema =
  baseEventHandlerSchema.extend({
    subject: z.string(),
    message: z.string(),
    eventId: z.string().uuid(),
    organizerUserId: z.string().uuid(),
  });

export async function handleMessageToAllAttendees({
  eventId,
  message,
  organizerUserId,
  subject,
}: z.infer<typeof handleMessageToAllAttendeesInputSchema>) {
  const event = await prisma.event.findUnique({where: {id: eventId}});

  const organizerUser = await prisma.user.findUnique({
    where: {id: organizerUserId},
  });

  if (!organizerUser) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Organizer user not found',
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

  await Promise.all(
    signUps
      .map(signUp => signUp.user)
      .map(async user => {
        const messageData = {
          replyTo: `${organizerUser.firstName} ${organizerUser.lastName} <${organizerUser.email}>`,
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
