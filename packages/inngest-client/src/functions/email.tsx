import {formatDate, getBaseUrl, invariant, isOrganization, isUser} from 'utils';
import {inngest} from '../client';
import {subHours, isFuture} from 'date-fns';
import {render} from '@react-email/render';
import {EventReminder} from 'email';

export const emailReminderScheduled = inngest.createFunction(
  {
    name: 'Email Reminder Scheduled',
    cancelOn: [
      {event: 'event.removed', match: 'data.eventId'},
      {event: 'event.unpublished', match: 'data.eventId'},
      {event: 'event.updated', match: 'data.eventId'},
    ],
  },
  {event: 'email/reminder.scheduled'},
  async ctx => {
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

    await ctx.step.sleepUntil(reminderDate);

    await ctx.step.run('Send event reminder email to attendees', async () => {
      // if free event
      if (event.eventSignUps.length > 0) {
        const events = event.eventSignUps
          .filter(signUp => signUp.status === 'REGISTERED')
          .map(signUp => signUp.user)
          .map(user => {
            return {
              name: 'email/reminder.sent',
              data: {userId: user.id, eventId: event.id},
            } as const;
          });

        await ctx.step.sendEvent(events);
      }

      // if paid event
      if (event.ticketSales.length > 0) {
        const events = event.ticketSales
          .map(sale => sale.user)
          .map(user => {
            return {
              name: 'email/reminder.sent',
              data: {userId: user.id, eventId: event.id},
            } as const;
          });

        await ctx.step.sendEvent(events);
      }
    });
  }
);

export const emailReminderSent = inngest.createFunction(
  {
    name: 'Email Reminder Sent',
  },
  {event: 'email/reminder.sent'},
  async ctx => {
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

    const cancelEventUrl = new URL(`${getBaseUrl()}/api/cancel-signup`);
    cancelEventUrl.searchParams.append('eventShortId', event.shortId);
    cancelEventUrl.searchParams.append('email', user.email);

    const organizerName = isUser(organizer)
      ? `${organizer.firstName} ${organizer.lastName}`
      : isOrganization(organizer)
      ? `${organizer.name}`
      : '';

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
          startDate={formatDate(new Date(event.startDate), 'MMMM d, yyyy')}
          endDate={formatDate(new Date(event.endDate), 'MMMM d, yyyy')}
          organizerName={organizerName}
        />
      ),
    });
  }
);
