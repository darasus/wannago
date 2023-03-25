import {baseEventHandlerSchema} from '../validation/baseEventHandlerSchema';
import {Postmark} from 'lib';
import {z} from 'zod';
import {TRPCError} from '@trpc/server';
import {prisma} from 'database';
import {EventSignUp} from 'email';
import {render} from '@react-email/render';
import {getBaseUrl, formatDate, isUser} from 'utils';

const postmark = new Postmark();

export const handleEventSignUpEmailInputSchema = baseEventHandlerSchema.extend({
  eventId: z.string().uuid(),
  userId: z.string().uuid(),
});

export async function handleEventSignUpEmail({
  eventId,
  userId,
}: z.infer<typeof handleEventSignUpEmailInputSchema>) {
  const event = await prisma.event.findUnique({
    where: {id: eventId},
    include: {
      user: true,
      organization: true,
    },
  });

  if (!event) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Event not found',
    });
  }

  const organizerUser = event.user || event.organization;

  if (!organizerUser) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Organizer not found',
    });
  }

  const user = await prisma.user.findUnique({
    where: {id: userId},
  });

  if (!user) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'User not found',
    });
  }

  const cancelEventUrl = new URL(`${getBaseUrl()}/api/cancel-signup`);
  cancelEventUrl.searchParams.append('eventShortId', event.shortId);
  cancelEventUrl.searchParams.append('email', user.email);

  const organizerName = isUser(organizerUser)
    ? `${organizerUser.firstName} ${organizerUser.lastName}`
    : `${organizerUser.name}`;

  await postmark.sendToTransactionalStream({
    replyTo: 'WannaGo Team <hi@wannago.app>',
    to: user.email,
    subject: `Thanks for signing up for "${event.title}"!`,
    htmlString: render(
      <EventSignUp
        title={event.title}
        address={event.address || 'none'}
        streamUrl={event.streamUrl || 'none'}
        eventUrl={`${getBaseUrl()}/e/${event.shortId}`}
        cancelEventUrl={cancelEventUrl.toString()}
        startDate={formatDate(event.startDate, 'MMMM d, yyyy')}
        endDate={formatDate(event.endDate, 'MMMM d, yyyy')}
        organizerName={organizerName}
      />
    ),
  });
}
