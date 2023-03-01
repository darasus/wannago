import {render} from '@react-email/render';
import {TRPCError} from '@trpc/server';
import {prisma} from 'database';
import {Postmark} from 'lib';
import {formatDate, getBaseUrl} from 'utils';
import {z} from 'zod';
import {EventInvite} from 'email';
import {baseEventHandlerSchema} from '../validation/baseEventHandlerSchema';

const postmark = new Postmark();

export const handleEventInviteInputSchema = baseEventHandlerSchema.extend({
  eventId: z.string().uuid(),
  userId: z.string().uuid(),
});

export async function handleEventInvite({
  eventId,
  userId,
}: z.infer<typeof handleEventInviteInputSchema>) {
  const event = await prisma.event.findUnique({
    where: {id: eventId},
    include: {
      organization: {
        include: {
          users: true,
        },
      },
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

  const organizerUser = event.organization?.users[0];

  if (!organizerUser) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Organizer user not found',
    });
  }

  const url = new URL(`${getBaseUrl()}/api/confirm-invite`);

  url.searchParams.append('eventShortId', event.shortId!);
  url.searchParams.append('email', user.email);

  await postmark.sendTransactionalEmail({
    replyTo: 'WannaGo Team <hi@wannago.app>',
    to: user.email,
    subject: `You're invited to: "${event.title}"!`,
    htmlString: render(
      <EventInvite
        title={event.title}
        address={event.address || 'none'}
        streamUrl={event.streamUrl || 'none'}
        confirmUrl={url.toString()}
        startDate={formatDate(event.startDate, 'MMMM d, yyyy')}
        endDate={formatDate(event.endDate, 'MMMM d, yyyy')}
        organizerName={`${organizerUser.firstName} ${organizerUser.lastName}`}
      />
    ),
  });
}
