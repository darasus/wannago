import {formatDate, getBaseUrl, invariant, isOrganization, isUser} from 'utils';
import {inngest} from '../client';
import {subHours, isFuture} from 'date-fns';
import {
  AfterRegisterNoCreatedEventFollowUpEmail,
  EventCancelInvite,
  EventCancelSignUp,
  EventInvite,
  EventSignUp,
  MessageToAttendees,
  OrganizerEventSignUpNotification,
  TicketPurchaseSuccess,
  VerifyEmail,
  render,
} from 'email';
import {EventReminder} from 'email';
import {
  eventNotFoundError,
  organizerNotFoundError,
  userNotFoundError,
} from 'error';
import {slugify} from 'inngest';

export const emailReminderScheduled = inngest.createFunction(
  {
    id: slugify('Email Reminder Scheduled'),
    name: 'Email Reminder Scheduled',
    cancelOn: [
      {event: 'event.removed', match: 'data.eventId'},
      {event: 'event.unpublished', match: 'data.eventId'},
      {event: 'event.updated', match: 'data.eventId'},
    ],
  },
  {event: 'email/reminder.scheduled'},
  async (ctx) => {
    const event = await ctx.step.run('Fetch event', () => {
      return ctx.prisma.event.findUnique({
        where: {
          id: ctx.event.data.eventId,
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
          ticketSales: {
            include: {
              user: true,
            },
          },
        },
      });
    });

    if (!event?.endDate) {
      return null;
    }

    const endDate = new Date(event.endDate);
    const reminderDate = subHours(endDate, 3); // 3 hours before event

    // don't run reminders for past events
    if (!isFuture(reminderDate)) {
      return null;
    }

    await ctx.step.sleepUntil('wait-before-reminder-date', reminderDate);

    await ctx.step.run('Send event reminder email to attendees', async () => {
      // if free event
      if (event.eventSignUps.length > 0) {
        const events = event.eventSignUps
          .filter((signUp) => signUp.status === 'REGISTERED')
          .map((signUp) => signUp.user)
          .map((user) => {
            return {
              name: 'email/reminder.sent',
              data: {userId: user.id, eventId: event.id},
            } as const;
          });

        await ctx.step.sendEvent('send-event-reminder-email', events);
      }

      // if paid event
      if (event.ticketSales.length > 0) {
        const events = event.ticketSales
          .map((sale) => sale.user)
          .map((user) => {
            return {
              name: 'email/reminder.sent',
              data: {userId: user.id, eventId: event.id},
            } as const;
          });

        await ctx.step.sendEvent('send-event-reminder-email', events);
      }
    });
  }
);

export const emailReminderSent = inngest.createFunction(
  {
    id: slugify('Email Reminder Sent'),
    name: 'Email Reminder Sent',
  },
  {event: 'email/reminder.sent'},
  async (ctx) => {
    const event = await ctx.step.run('Fetch event', () => {
      return ctx.prisma.event.findUnique({
        where: {id: ctx.event.data.eventId},
        include: {user: true, organization: true},
      });
    });
    const user = await ctx.step.run('Fetch user', () => {
      return ctx.prisma.user.findUnique({where: {id: ctx.event.data.userId}});
    });
    const organizer = event?.organization || event?.user;

    invariant(event);
    invariant(user);
    invariant(organizer);

    const organizerName = isUser(organizer)
      ? `${organizer.firstName} ${organizer.lastName}`
      : isOrganization(organizer)
        ? `${organizer.name}`
        : '';

    return ctx.postmark.sendToTransactionalStream({
      replyTo: 'WannaGo Team <hello@wannago.app>',
      to: user.email,
      subject: `Your event is coming up "${event.title}"!`,
      htmlString: render(
        <EventReminder
          title={event.title}
          address={event.address || 'none'}
          eventUrl={`${getBaseUrl()}/e/${event.shortId}`}
          startDate={formatDate(new Date(event.startDate), 'MMMM d, yyyy')}
          endDate={formatDate(new Date(event.endDate), 'MMMM d, yyyy')}
          organizerName={organizerName}
        />
      ),
    });
  }
);

export const ticketPurchaseEmailSent = inngest.createFunction(
  {
    id: slugify('Ticket Purchase Email Sent'),
    name: 'Ticket Purchase Email Sent',
  },
  {event: 'email/ticket-purchase-email.sent'},
  async (ctx) => {
    const event = await ctx.step.run('Fetch event', () =>
      ctx.prisma.event.findUnique({
        where: {id: ctx.event.data.eventId},
        include: {
          user: true,
          organization: true,
        },
      })
    );
    const user = await ctx.step.run('Fetch event', () =>
      ctx.prisma.user.findUnique({
        where: {id: ctx.event.data.userId},
      })
    );

    invariant(event, eventNotFoundError);
    invariant(user, userNotFoundError);

    const organizer = event?.organization || event?.user;

    const organizerName = isUser(organizer)
      ? `${organizer.firstName} ${organizer.lastName}`
      : isOrganization(organizer)
        ? `${organizer.name}`
        : '';

    await ctx.step.run(
      `Sent ticket purchase confirmation to user's email`,
      async () => {
        const {numberOfPurchasedTickets} =
          await ctx.actions.getNumberOfPurchasedTickets({
            ticketSaleIds: ctx.event.data.ticketSaleIds,
          });

        return ctx.postmark.sendToTransactionalStream({
          replyTo: 'WannaGo Team <hello@wannago.app>',
          to: user.email,
          subject: `Order confirmation`,
          htmlString: render(
            <TicketPurchaseSuccess
              title={event.title}
              address={event.address || 'none'}
              eventUrl={`${getBaseUrl()}/e/${event.shortId}`}
              ticketUrl={`${getBaseUrl()}/e/${event.shortId}/my-tickets`}
              startDate={formatDate(new Date(event.startDate), 'MMMM d, yyyy')}
              endDate={formatDate(new Date(event.endDate), 'MMMM d, yyyy')}
              organizerName={organizerName}
              numberOfTickets={numberOfPurchasedTickets}
            />
          ),
        });
      }
    );
  }
);

export const eventSignUp = inngest.createFunction(
  {
    id: slugify('Event Sign Up'),
    name: 'Event Sign Up',
  },
  {event: 'email/event.sign.up'},
  async (ctx) => {
    const event = await ctx.prisma.event.findUnique({
      where: {id: ctx.event.data.eventId},
      include: {
        user: true,
        organization: true,
      },
    });

    invariant(event, eventNotFoundError);

    const organizer = event.user || event.organization;

    invariant(organizer, organizerNotFoundError);

    const user = await ctx.prisma.user.findUnique({
      where: {id: ctx.event.data.userId},
    });

    invariant(user, userNotFoundError);

    const organizerName = isUser(organizer)
      ? `${organizer.firstName} ${organizer.lastName}`
      : `${organizer.name}`;

    await ctx.postmark.sendToTransactionalStream({
      replyTo: 'WannaGo Team <hello@wannago.app>',
      to: user.email,
      subject: `Thanks for signing up for "${event.title}"!`,
      htmlString: render(
        <EventSignUp
          title={event.title}
          address={event.address || 'none'}
          eventUrl={`${getBaseUrl()}/e/${event.shortId}`}
          startDate={formatDate(event.startDate, 'MMMM d, yyyy')}
          endDate={formatDate(event.endDate, 'MMMM d, yyyy')}
          organizerName={organizerName}
        />
      ),
    });
  }
);

export const eventInvite = inngest.createFunction(
  {
    id: slugify('Event Invite'),
    name: 'Event Invite',
  },
  {event: 'email/event.invite'},
  async (ctx) => {
    const event = await ctx.prisma.event.findUnique({
      where: {id: ctx.event.data.eventId},
      include: {
        user: true,
        organization: true,
      },
    });

    invariant(event, eventNotFoundError);

    const user = await ctx.prisma.user.findUnique({
      where: {id: ctx.event.data.userId},
    });

    invariant(user, userNotFoundError);

    const organizer = event.user || event.organization;

    invariant(organizer, organizerNotFoundError);

    const eventUrl = new URL(`${getBaseUrl()}/e/${event.shortId}`);

    const organizerName = isUser(organizer)
      ? `${organizer.firstName} ${organizer.lastName}`
      : `${organizer.name}`;

    await ctx.postmark.sendToTransactionalStream({
      replyTo: 'WannaGo Team <hello@wannago.app>',
      to: user.email,
      subject: `You're invited to: "${event.title}"!`,
      htmlString: render(
        <EventInvite
          title={event.title}
          address={event.address || 'none'}
          eventUrl={eventUrl.toString()}
          startDate={formatDate(event.startDate, 'MMMM d, yyyy')}
          endDate={formatDate(event.endDate, 'MMMM d, yyyy')}
          organizerName={organizerName}
        />
      ),
    });
  }
);

export const messageToAllAttendees = inngest.createFunction(
  {
    id: slugify('Message To All Attendees'),
    name: 'Message To All Attendees',
  },
  {event: 'email/message.to.all.attendees'},
  async (ctx) => {
    const event = await ctx.prisma.event.findFirst({
      where: {
        id: ctx.event.data.eventId,
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
        eventId: ctx.event.data.eventId,
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
        .map((signUp) => signUp.user)
        .map(async (user) => {
          const messageData = {
            replyTo: `${name} <${organizer.email}>`,
            to: user.email,
            subject: `Message from event organizer: "${event.title}"`,
            htmlString: render(
              <MessageToAttendees
                eventUrl={`${getBaseUrl()}/e/${event?.shortId}`}
                message={ctx.event.data.message}
                eventTitle={event.title}
                subject={ctx.event.data.subject}
              />
            ),
          };

          await ctx.postmark.sendToTransactionalStream(messageData);
        })
    );
  }
);

export const afterRegisterNoCreatedEventFollowUpEmail = inngest.createFunction(
  {
    id: slugify('After Register No Created Event Follow Up Email'),
    name: 'After Register No Created Event Follow Up Email',
  },
  {event: 'email/after.register.no.created.event.follow.up.email'},
  async (ctx) => {
    await ctx.step.sleep(
      `wait-before-sending-${slugify(
        'After Register No Created Event Follow Up Email'
      )}`,
      1000 * 60 * 60 * 24 * 2
    );

    const user = await ctx.prisma.user.findUnique({
      where: {id: ctx.event.data.userId},
      include: {
        events: true,
        organizations: {
          include: {events: true},
        },
      },
    });

    invariant(user, userNotFoundError);

    const eventCount =
      user.events.length +
      user.organizations.reduce((prev, next) => {
        return prev + next.events.length;
      }, 0);

    const hasNoEvents = eventCount === 0;

    if (hasNoEvents && user?.firstName) {
      await ctx.postmark.sendToBroadcastStream({
        replyTo: 'WannaGo Team <hello@wannago.app>',
        to: user.email,
        subject: 'We would love to hear your feedback',
        htmlString: render(
          <AfterRegisterNoCreatedEventFollowUpEmail
            firstName={user?.firstName}
          />
        ),
      });
    }
  }
);

export const eventCancelInvite = inngest.createFunction(
  {
    id: slugify('Event Cancel Invite'),
    name: 'Event Cancel Invite',
  },
  {event: 'email/event.cancel.invite'},
  async (ctx) => {
    const event = await ctx.prisma.event.findUnique({
      where: {id: ctx.event.data.eventId},
      include: {
        user: true,
        organization: true,
      },
    });

    invariant(event, eventNotFoundError);

    const organizer = event.user || event.organization;

    invariant(organizer, organizerNotFoundError);

    const user = await ctx.prisma.user.findUnique({
      where: {id: ctx.event.data.userId},
    });

    invariant(user, userNotFoundError);

    const url = new URL(`${getBaseUrl()}/e/${event.shortId}`);
    const organizerName = isUser(organizer)
      ? `${organizer.firstName} ${organizer.lastName}`
      : `${organizer.name}`;

    await ctx.postmark.sendToTransactionalStream({
      replyTo: 'WannaGo Team <hello@wannago.app>',
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
  }
);

export const eventCancelSignUp = inngest.createFunction(
  {
    id: slugify('Event Cancel Sign Up'),
    name: 'Event Cancel Sign Up',
  },
  {event: 'email/event.cancel.sign.up'},
  async (ctx) => {
    const event = await ctx.prisma.event.findUnique({
      where: {id: ctx.event.data.eventId},
      include: {
        user: true,
        organization: true,
      },
    });

    invariant(event, eventNotFoundError);

    const organizer = event.user || event.organization;

    invariant(organizer, organizerNotFoundError);

    const user = await ctx.prisma.user.findUnique({
      where: {id: ctx.event.data.userId},
    });

    invariant(user, userNotFoundError);

    const url = new URL(`${getBaseUrl()}/e/${event.shortId}}`);
    const organizerName = isUser(organizer)
      ? `${organizer.firstName} ${organizer.lastName}`
      : `${organizer.name}`;

    await ctx.postmark.sendToTransactionalStream({
      replyTo: 'WannaGo Team <hello@wannago.app>',
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
  }
);

export const organizerEventSignUpNotification = inngest.createFunction(
  {
    id: slugify('Organizer Event Sign Up Notification'),
    name: 'Organizer Event Sign Up Notification',
  },
  {event: 'email/organizer.event.sign.up.notification'},
  async (ctx) => {
    const user = await ctx.prisma.user.findUnique({
      where: {id: ctx.event.data.userId},
    });

    invariant(user, userNotFoundError);

    const event = await ctx.prisma.event.findFirst({
      where: {
        id: ctx.event.data.eventId,
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
      replyTo: 'WannaGo Team <hello@wannago.app>',
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
  }
);

export const verifyEmailAddressEmail = inngest.createFunction(
  {
    id: slugify('Verify Email Address Email'),
    name: 'Verify Email Address Email',
  },
  {event: 'email/verify.email.email'},
  async (ctx) => {
    const user = await ctx.prisma.user.findUnique({
      where: {id: ctx.event.data.userId},
    });

    invariant(user, userNotFoundError);

    if (!user.email_verified) {
      await ctx.postmark.sendToTransactionalStream({
        replyTo: 'WannaGo Team <hello@wannago.app>',
        to: user.email,
        subject: 'Please verify your email',
        htmlString: render(
          <VerifyEmail
            verifyUrl={`${getBaseUrl()}/api/verify-email/${
              ctx.event.data.code
            }`}
          />
        ),
      });
    }
  }
);
