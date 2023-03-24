import {EmailType} from '@prisma/client';
import {render} from '@react-email/render';
import {TRPCError} from '@trpc/server';
import {prisma} from 'database';
import {Postmark} from 'lib';
import {z} from 'zod';
import {
  AfterRegisterNoCreatedEventFollowUpEmail,
  OrganizerEventSignUpNotification,
} from 'email';
import {baseEventHandlerSchema} from '../validation/baseEventHandlerSchema';
import {getBaseUrl} from 'utils';

const postmark = new Postmark();

export const handleOrganizerEventSignUpNotificationEmailInputSchema =
  baseEventHandlerSchema.extend({
    userId: z.string().uuid(),
    eventId: z.string().uuid(),
  });

export async function handleOrganizerEventSignUpNotificationEmail({
  userId,
  eventId,
}: z.infer<typeof handleOrganizerEventSignUpNotificationEmailInputSchema>) {
  const user = await prisma.user.findUnique({
    where: {id: userId},
  });

  if (!user) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'User not found',
    });
  }

  const event = await prisma.event.findFirst({
    where: {
      id: eventId,
    },
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

  await postmark.sendToOrganizerEventSignUpNotificationStream({
    replyTo: 'WannaGo Team <hi@wannago.app>',
    //TODO: '' should not be allowed
    to: organizerUser?.email || '',
    subject: 'Your event has new sign up!',
    htmlString: render(
      <OrganizerEventSignUpNotification
        eventTitle={event.title}
        eventAttendeesUrl={`${getBaseUrl()}/e/${event.shortId}/attendees`}
        userFullName={`${user.firstName} ${user.lastName}`}
      />
    ),
  });
}
