import {slugify} from 'inngest';
import {inngest} from '../client';

export const eventCreated = inngest.createFunction(
  {id: slugify('Event Created'), name: 'Event Created'},
  {event: 'event.created'},
  async (ctx) => {}
);

export const eventUpdated = inngest.createFunction(
  {id: slugify('Event Updated'), name: 'Event Updated'},
  {event: 'event.updated'},
  async (ctx) => {
    const event = await ctx.step.run('Fetch event', () =>
      ctx.prisma.event.findUnique({
        where: {id: ctx.event.data.eventId},
        include: {
          tickets: true,
        },
      })
    );

    if (event?.isPublished === true) {
      const isPaidEvent = event?.tickets && event?.tickets.length > 0;

      if (isPaidEvent) {
        await ctx.step.sendEvent('schedule-payout', {
          name: 'stripe/payout.scheduled',
          data: {
            eventId: ctx.event.data.eventId,
          },
        });
      }

      await ctx.step.sendEvent('schedule-reminder', {
        name: 'email/reminder.scheduled',
        data: {
          eventId: ctx.event.data.eventId,
        },
      });
    }
  }
);

export const eventPublished = inngest.createFunction(
  {id: slugify('Event Published'), name: 'Event Published'},
  {event: 'event.published'},
  async (ctx) => {
    const event = await ctx.step.run('Fetch event', () =>
      ctx.prisma.event.findUnique({
        where: {id: ctx.event.data.eventId},
        include: {
          tickets: true,
        },
      })
    );
    const isPaidEvent = event?.tickets && event?.tickets.length > 0;

    if (isPaidEvent) {
      await ctx.step.sendEvent('schedule-payout', {
        name: 'stripe/payout.scheduled',
        data: {
          eventId: ctx.event.data.eventId,
        },
      });
    }

    await ctx.step.sendEvent('schedule-reminder', {
      name: 'email/reminder.scheduled',
      data: {
        eventId: ctx.event.data.eventId,
      },
    });
  }
);

export const eventUnpublished = inngest.createFunction(
  {id: slugify('Event Unpublished'), name: 'Event Unpublished'},
  {event: 'event.unpublished'},
  async ({event}) => {
    console.log(event);
  }
);

export const eventRemoved = inngest.createFunction(
  {id: slugify('Event Removed'), name: 'Event Removed'},
  {event: 'event.removed'},
  async ({event}) => {
    console.log(event);
  }
);
