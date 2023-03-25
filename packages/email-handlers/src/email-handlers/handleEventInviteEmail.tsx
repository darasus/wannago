import {render} from '@react-email/render';
import {TRPCError} from '@trpc/server';
import {prisma} from 'database';
import {Postmark} from 'lib';
import {formatDate, getBaseUrl, isUser} from 'utils';
import {z} from 'zod';
import {EventInvite} from 'email';
import {baseEventHandlerSchema} from '../validation/baseEventHandlerSchema';

const postmark = new Postmark();

export const handleEventInviteEmailInputSchema = baseEventHandlerSchema.extend({
  eventId: z.string().uuid(),
  userId: z.string().uuid(),
});

export async function handleEventInviteEmail({
  eventId,
  userId,
}: z.infer<typeof handleEventInviteEmailInputSchema>) {
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

  const user = await prisma.user.findUnique({
    where: {id: userId},
  });

  if (!user) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'User not found',
    });
  }

  const organizerUser = event.user || event.organization;

  if (!organizerUser) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Organizer not found',
    });
  }

  const confirmEventUrl = new URL(`${getBaseUrl()}/api/confirm-invite`);
  confirmEventUrl.searchParams.append('eventShortId', event.shortId!);
  confirmEventUrl.searchParams.append('email', user.email);
  const cancelEventUrl = new URL(`${getBaseUrl()}/api/cancel-invite`);
  cancelEventUrl.searchParams.append('eventShortId', event.shortId!);
  cancelEventUrl.searchParams.append('email', user.email);

  const organizerName = isUser(organizerUser)
    ? `${organizerUser.firstName} ${organizerUser.lastName}`
    : `${organizerUser.name}`;

  await postmark.sendToTransactionalStream({
    replyTo: 'WannaGo Team <hi@wannago.app>',
    to: user.email,
    subject: `You're invited to: "${event.title}"!`,
    htmlString: render(
      <EventInvite
        title={event.title}
        address={event.address || 'none'}
        streamUrl={event.streamUrl || 'none'}
        confirmEventUrl={confirmEventUrl.toString()}
        cancelEventUrl={cancelEventUrl.toString()}
        startDate={formatDate(event.startDate, 'MMMM d, yyyy')}
        endDate={formatDate(event.endDate, 'MMMM d, yyyy')}
        organizerName={organizerName}
      />
    ),
  });
}
