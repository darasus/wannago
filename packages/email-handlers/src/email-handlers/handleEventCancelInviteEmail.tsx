import {render} from '@react-email/render';
import {TRPCError} from '@trpc/server';
import {prisma} from 'database';
import {Postmark} from 'lib';
import {z} from 'zod';
import {EventCancelInvite} from 'email';
import {baseEventHandlerSchema} from '../validation/baseEventHandlerSchema';
import {formatDate, getBaseUrl} from 'utils';

const postmark = new Postmark();

export const handleEventCancelInviteEmailInputSchema =
  baseEventHandlerSchema.extend({
    userId: z.string().uuid(),
    eventId: z.string().uuid(),
  });

export async function handleEventCancelInviteEmail({
  eventId,
  userId,
}: z.infer<typeof handleEventCancelInviteEmailInputSchema>) {
  const event = await prisma.event.findUnique({
    where: {id: eventId},
    include: {
      user: true,
    },
  });

  if (!event) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Event not found',
    });
  }

  const organizerUser = event.user;

  const user = await prisma.user.findUnique({
    where: {id: userId},
  });

  if (!user) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'User not found',
    });
  }

  const url = new URL(`${getBaseUrl()}/e/${event.shortId}`);

  await postmark.sendToTransactionalStream({
    replyTo: 'WannaGo Team <hi@wannago.app>',
    to: user.email,
    subject: `Your invite has been cancelled...`,
    htmlString: render(
      <EventCancelInvite
        title={event.title}
        address={event.address || 'none'}
        streamUrl={event.streamUrl || 'none'}
        eventUrl={url.toString()}
        startDate={formatDate(event.startDate, 'MMMM d, yyyy')}
        endDate={formatDate(event.endDate, 'MMMM d, yyyy')}
        organizerName={`${organizerUser?.firstName} ${organizerUser?.lastName}`}
      />
    ),
  });
}
