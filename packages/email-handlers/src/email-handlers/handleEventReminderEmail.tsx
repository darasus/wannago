import {render} from '@react-email/render';
import {TRPCError} from '@trpc/server';
import {prisma} from 'database';
import {Postmark} from 'lib';
import {z} from 'zod';
import {EventCancelInvite, EventReminder} from 'email';
import {baseEventHandlerSchema} from '../validation/baseEventHandlerSchema';
import {formatDate, getBaseUrl} from 'utils';

const postmark = new Postmark();

export const handleEventReminderEmailInputSchema =
  baseEventHandlerSchema.extend({
    eventId: z.string().uuid(),
  });

export async function handleEventReminderEmail({
  eventId,
}: z.infer<typeof handleEventReminderEmailInputSchema>) {
  const event = await prisma.event.findUnique({
    where: {
      id: eventId,
    },
    include: {
      organization: {
        include: {
          users: true,
        },
      },
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
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Event not found',
    });
  }

  if (!event.isPublished) {
    return null;
  }

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
              streamUrl={event.streamUrl || 'none'}
              eventUrl={`${getBaseUrl()}/e/${event.shortId}`}
              cancelEventUrl={cancelEventUrl.toString()}
              startDate={formatDate(event.startDate, 'MMMM d, yyyy')}
              endDate={formatDate(event.endDate, 'MMMM d, yyyy')}
              organizerName={`${event.organization?.users[0].firstName} ${event.organization?.users[0].lastName}`}
            />
          ),
        });
      })
  );
}
