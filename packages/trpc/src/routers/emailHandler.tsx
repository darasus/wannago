import {publicProcedure, router} from '../trpcServer';
import {z} from 'zod';
import {formatDate, getBaseUrl, invariant, isUser} from 'utils';
import {render} from '@react-email/render';
import {
  EventSignUp,
  EventInvite,
  MessageToOrganizer,
  MessageToAttendees,
  AfterRegisterNoCreatedEventFollowUpEmail,
  EventCancelInvite,
  EventCancelSignUp,
  OrganizerEventSignUpNotification,
  EventReminder,
} from 'email';
import {EmailType} from '../../../../apps/web/src/types/EmailType';
import {
  eventNotFoundError,
  organizerNotFoundError,
  userNotFoundError,
} from 'error';

export const baseEventHandlerSchema = z
  .object({
    type: z.nativeEnum(EmailType),
  })
  .passthrough();

export const handleEventSignUpEmailInputSchema = baseEventHandlerSchema.extend({
  eventId: z.string().uuid(),
  userId: z.string().uuid(),
});

const handleEventSignUpEmail = publicProcedure
  .input(handleEventSignUpEmailInputSchema)
  .mutation(async ({ctx, input}) => {
    const event = await ctx.prisma.event.findUnique({
      where: {id: input.eventId},
      include: {
        user: true,
        organization: true,
      },
    });

    invariant(event, eventNotFoundError);

    const organizer = event.user || event.organization;

    invariant(organizer, organizerNotFoundError);

    const user = await ctx.prisma.user.findUnique({
      where: {id: input.userId},
    });

    invariant(user, userNotFoundError);

    const cancelEventUrl = new URL(`${getBaseUrl()}/api/cancel-signup`);
    cancelEventUrl.searchParams.append('eventShortId', event.shortId);
    cancelEventUrl.searchParams.append('email', user.email);

    const organizerName = isUser(organizer)
      ? `${organizer.firstName} ${organizer.lastName}`
      : `${organizer.name}`;

    await ctx.postmark.sendToTransactionalStream({
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

    return {success: true};
  });

export const handleEventInviteEmailInputSchema = baseEventHandlerSchema.extend({
  eventId: z.string().uuid(),
  userId: z.string().uuid(),
});

const handleEventInviteEmail = publicProcedure
  .input(handleEventInviteEmailInputSchema)
  .mutation(async ({ctx, input}) => {
    const event = await ctx.prisma.event.findUnique({
      where: {id: input.eventId},
      include: {
        user: true,
        organization: true,
      },
    });

    invariant(event, eventNotFoundError);

    const user = await ctx.prisma.user.findUnique({
      where: {id: input.userId},
    });

    invariant(user, userNotFoundError);

    const organizer = event.user || event.organization;

    invariant(organizer, organizerNotFoundError);

    const confirmEventUrl = new URL(`${getBaseUrl()}/api/confirm-invite`);
    confirmEventUrl.searchParams.append('eventShortId', event.shortId!);
    confirmEventUrl.searchParams.append('email', user.email);
    const cancelEventUrl = new URL(`${getBaseUrl()}/api/cancel-invite`);
    cancelEventUrl.searchParams.append('eventShortId', event.shortId!);
    cancelEventUrl.searchParams.append('email', user.email);

    const organizerName = isUser(organizer)
      ? `${organizer.firstName} ${organizer.lastName}`
      : `${organizer.name}`;

    await ctx.postmark.sendToTransactionalStream({
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

    return {success: true};
  });

export const handleMessageToOrganizerEmailInputSchema =
  baseEventHandlerSchema.extend({
    eventId: z.string().uuid(),
    organizerName: z.string(),
    organizerEmail: z.string().email(),
    email: z.string().email(),
    subject: z.string(),
    message: z.string(),
  });

const handleMessageToOrganizerEmail = publicProcedure
  .input(handleMessageToOrganizerEmailInputSchema)
  .mutation(async ({ctx, input}) => {
    const event = await ctx.prisma.event.findUnique({
      where: {id: input.eventId},
    });

    invariant(event, eventNotFoundError);

    await ctx.postmark.sendToTransactionalStream({
      replyTo: `${input.organizerName} <${input.email}>`,
      to: input.organizerEmail,
      subject: 'Someone asked you a question on WannaGo',
      htmlString: render(
        <MessageToOrganizer
          eventTitle={event.title}
          eventUrl={`${getBaseUrl()}/e/${event?.shortId}`}
          message={input.message}
          subject={input.subject}
          senderName={input.organizerName}
          senderEmail={input.email}
        />
      ),
    });

    return {success: true};
  });

export const handleMessageToAllAttendeesEmailInputSchema =
  baseEventHandlerSchema.extend({
    subject: z.string(),
    message: z.string(),
    eventId: z.string().uuid(),
    organizerId: z.string().uuid(),
  });

const handleMessageToAllAttendeesEmail = publicProcedure
  .input(handleMessageToAllAttendeesEmailInputSchema)
  .mutation(async ({ctx, input}) => {
    const event = await ctx.prisma.event.findFirst({
      where: {
        id: input.eventId,
      },
      include: {
        user: true,
        organization: true,
      },
    });

    invariant(event, eventNotFoundError);

    const organizer = event.user || event.organization;

    invariant(organizer, organizerNotFoundError);

    const signUps = await ctx.prisma.eventSignUp.findMany({
      where: {
        eventId: input.eventId,
        status: 'REGISTERED',
      },
      include: {
        user: true,
      },
    });

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
                message={input.message}
                eventTitle={event.title}
                subject={input.subject}
              />
            ),
          };

          await ctx.postmark.sendToTransactionalStream(messageData);
        })
    );

    return {success: true};
  });

export const handleAfterRegisterNoCreatedEventFollowUpEmailInputSchema =
  baseEventHandlerSchema.extend({
    userId: z.string().uuid(),
  });

const handleAfterRegisterNoCreatedEventFollowUpEmail = publicProcedure
  .input(handleAfterRegisterNoCreatedEventFollowUpEmailInputSchema)
  .mutation(async ({ctx, input}) => {
    const user = await ctx.prisma.user.findUnique({
      where: {id: input.userId},
    });

    invariant(user, userNotFoundError);

    const eventCount = await ctx.prisma.event.count({
      where: {
        organizationId: user.organizationId,
      },
    });

    const hasNoEvents = eventCount === 0;

    if (hasNoEvents && user?.firstName) {
      await ctx.postmark.sendToBroadcastStream({
        replyTo: 'WannaGo Team <hi@wannago.app>',
        to: user.email,
        subject: 'We would love to hear your feedback',
        htmlString: render(
          <AfterRegisterNoCreatedEventFollowUpEmail
            firstName={user?.firstName}
          />
        ),
      });
    }

    return {success: true};
  });

export const handleEventCancelInviteEmailInputSchema =
  baseEventHandlerSchema.extend({
    userId: z.string().uuid(),
    eventId: z.string().uuid(),
  });

const handleEventCancelInviteEmail = publicProcedure
  .input(handleEventCancelInviteEmailInputSchema)
  .mutation(async ({ctx, input}) => {
    const event = await ctx.prisma.event.findUnique({
      where: {id: input.eventId},
      include: {
        user: true,
        organization: true,
      },
    });

    invariant(event, eventNotFoundError);

    const organizer = event.user || event.organization;

    invariant(organizer, organizerNotFoundError);

    const user = await ctx.prisma.user.findUnique({
      where: {id: input.userId},
    });

    invariant(user, userNotFoundError);

    const url = new URL(`${getBaseUrl()}/e/${event.shortId}`);
    const organizerName = isUser(organizer)
      ? `${organizer.firstName} ${organizer.lastName}`
      : `${organizer.name}`;

    await ctx.postmark.sendToTransactionalStream({
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
          organizerName={organizerName || ''}
        />
      ),
    });

    return {success: true};
  });

export const handleEventCancelSignUpEmailInputSchema =
  baseEventHandlerSchema.extend({
    userId: z.string().uuid(),
    eventId: z.string().uuid(),
  });

const handleEventCancelSignUpEmail = publicProcedure
  .input(handleEventCancelSignUpEmailInputSchema)
  .mutation(async ({ctx, input}) => {
    const event = await ctx.prisma.event.findUnique({
      where: {id: input.eventId},
      include: {
        user: true,
        organization: true,
      },
    });

    invariant(event, eventNotFoundError);

    const organizer = event.user || event.organization;

    invariant(organizer, organizerNotFoundError);

    const user = await ctx.prisma.user.findUnique({
      where: {id: input.userId},
    });

    invariant(user, userNotFoundError);

    const url = new URL(`${getBaseUrl()}/e/${event.shortId}}`);
    const organizerName = isUser(organizer)
      ? `${organizer.firstName} ${organizer.lastName}`
      : `${organizer.name}`;

    await ctx.postmark.sendToTransactionalStream({
      replyTo: 'WannaGo Team <hi@wannago.app>',
      to: user.email,
      subject: `Your sign up has been cancelled...`,
      htmlString: render(
        <EventCancelSignUp
          title={event.title}
          address={event.address || 'none'}
          streamUrl={event.streamUrl || 'none'}
          eventUrl={url.toString()}
          startDate={formatDate(event.startDate, 'MMMM d, yyyy')}
          endDate={formatDate(event.endDate, 'MMMM d, yyyy')}
          organizerName={organizerName}
        />
      ),
    });

    return {success: true};
  });

export const handleOrganizerEventSignUpNotificationEmailInputSchema =
  baseEventHandlerSchema.extend({
    userId: z.string().uuid(),
    eventId: z.string().uuid(),
  });

const handleOrganizerEventSignUpNotificationEmail = publicProcedure
  .input(handleOrganizerEventSignUpNotificationEmailInputSchema)
  .mutation(async ({ctx, input}) => {
    const user = await ctx.prisma.user.findUnique({
      where: {id: input.userId},
    });

    invariant(user, userNotFoundError);

    const event = await ctx.prisma.event.findFirst({
      where: {
        id: input.eventId,
      },
      include: {
        user: true,
        organization: true,
      },
    });

    invariant(event, eventNotFoundError);

    const organizer = event.user || event.organization;

    invariant(organizer, organizerNotFoundError);

    await ctx.postmark.sendToOrganizerEventSignUpNotificationStream({
      replyTo: 'WannaGo Team <hi@wannago.app>',
      //TODO: '' should not be allowed
      to: organizer?.email || '',
      subject: 'Your event has new sign up!',
      htmlString: render(
        <OrganizerEventSignUpNotification
          eventTitle={event.title}
          eventAttendeesUrl={`${getBaseUrl()}/e/${event.shortId}/attendees`}
          userFullName={`${user.firstName} ${user.lastName}`}
        />
      ),
    });

    return {success: true};
  });

export const handleEventReminderEmailInputSchema =
  baseEventHandlerSchema.extend({
    eventId: z.string().uuid(),
  });

const handleEventReminderEmail = publicProcedure
  .input(handleEventReminderEmailInputSchema)
  .mutation(async ({ctx, input}) => {
    const event = await ctx.prisma.event.findUnique({
      where: {
        id: input.eventId,
      },
      include: {
        user: true,
        organization: true,
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

    invariant(event, eventNotFoundError);

    if (!event.isPublished) {
      return null;
    }

    const organizer = event.user || event.organization;

    invariant(organizer, organizerNotFoundError);

    const organizerName = isUser(organizer)
      ? `${organizer.firstName} ${organizer.lastName}`
      : `${organizer.name}`;

    await Promise.all(
      event.eventSignUps
        .filter(signUp => signUp.status === 'REGISTERED')
        .map(signUp => signUp.user)
        .map(user => {
          const cancelEventUrl = new URL(`${getBaseUrl()}/api/cancel-signup`);
          cancelEventUrl.searchParams.append('eventShortId', event.shortId!);
          cancelEventUrl.searchParams.append('email', user.email);

          return ctx.postmark.sendToTransactionalStream({
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
                organizerName={organizerName}
              />
            ),
          });
        })
    );

    return {success: true};
  });

export const emailHandlerRouter = router({
  handleEventSignUpEmail,
  handleEventInviteEmail,
  handleMessageToOrganizerEmail,
  handleMessageToAllAttendeesEmail,
  handleAfterRegisterNoCreatedEventFollowUpEmail,
  handleEventCancelInviteEmail,
  handleEventCancelSignUpEmail,
  handleOrganizerEventSignUpNotificationEmail,
  handleEventReminderEmail,
});
