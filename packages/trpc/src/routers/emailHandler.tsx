import {publicProcedure, router} from '../trpcServer';
import {formatDate, getBaseUrl, invariant, isUser} from 'utils';
import {render} from 'email';
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
import {
  eventNotFoundError,
  organizerNotFoundError,
  userNotFoundError,
} from 'error';
import {
  handleAfterRegisterNoCreatedEventFollowUpEmailInputSchema,
  handleEventCancelInviteEmailInputSchema,
  handleEventCancelSignUpEmailInputSchema,
  handleEventInviteEmailInputSchema,
  handleEventReminderEmailInputSchema,
  handleEventSignUpEmailInputSchema,
  handleMessageToAllAttendeesEmailInputSchema,
  handleMessageToOrganizerEmailInputSchema,
  handleOrganizerEventSignUpNotificationEmailInputSchema,
} from 'email-input-validation';

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

    const eventUrl = new URL(`${getBaseUrl()}/e/${event.shortId}`);
    const cancelEventUrl = new URL(`${getBaseUrl()}/api/cancel-invite`);
    cancelEventUrl.searchParams.append('eventShortId', event.shortId);
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
          eventUrl={eventUrl.toString()}
          cancelEventUrl={cancelEventUrl.toString()}
          startDate={formatDate(event.startDate, 'MMMM d, yyyy')}
          endDate={formatDate(event.endDate, 'MMMM d, yyyy')}
          organizerName={organizerName}
        />
      ),
    });

    return {success: true};
  });

const handleMessageToOrganizerEmail = publicProcedure
  .input(handleMessageToOrganizerEmailInputSchema)
  .mutation(async ({ctx, input}) => {
    const event = await ctx.prisma.event.findUnique({
      where: {id: input.eventId},
    });

    invariant(event, eventNotFoundError);

    await ctx.postmark.sendToTransactionalStream({
      replyTo: `${input.senderName} <${input.email}>`,
      to: input.organizerEmail,
      subject: 'Someone asked you a question on WannaGo',
      htmlString: render(
        <MessageToOrganizer
          eventTitle={event.title}
          eventUrl={`${getBaseUrl()}/e/${event?.shortId}`}
          message={input.message}
          subject={input.subject}
          senderName={input.senderName}
          senderEmail={input.email}
        />
      ),
    });

    return {success: true};
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
          eventUrl={url.toString()}
          startDate={formatDate(event.startDate, 'MMMM d, yyyy')}
          endDate={formatDate(event.endDate, 'MMMM d, yyyy')}
          organizerName={organizerName || ''}
        />
      ),
    });

    return {success: true};
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
          eventUrl={url.toString()}
          startDate={formatDate(event.startDate, 'MMMM d, yyyy')}
          endDate={formatDate(event.endDate, 'MMMM d, yyyy')}
          organizerName={organizerName}
        />
      ),
    });

    return {success: true};
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
          cancelEventUrl.searchParams.append('eventShortId', event.shortId);
          cancelEventUrl.searchParams.append('email', user.email);

          return ctx.postmark.sendToTransactionalStream({
            replyTo: 'WannaGo Team <hi@wannago.app>',
            to: user.email,
            subject: `Your event is coming up "${event.title}"!`,
            htmlString: render(
              <EventReminder
                title={event.title}
                address={event.address || 'none'}
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
