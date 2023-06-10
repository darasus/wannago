import {inngest} from '../client';

export const eventCreated = inngest.createFunction(
  {name: 'Event Created'},
  {event: 'event.created'},
  async ctx => {}
);

export const eventUpdated = inngest.createFunction(
  {name: 'Event Updated'},
  {event: 'event.updated'},
  async ctx => {
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
        await ctx.step.sendEvent({
          name: 'stripe/payout.scheduled',
          data: {
            eventId: ctx.event.data.eventId,
          },
        });
      }

      await ctx.step.sendEvent({
        name: 'email/reminder.scheduled',
        data: {
          eventId: ctx.event.data.eventId,
        },
      });
    }
  }
);

export const eventPublished = inngest.createFunction(
  {name: 'Event Published'},
  {event: 'event.published'},
  async ctx => {
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
      await ctx.step.sendEvent({
        name: 'stripe/payout.scheduled',
        data: {
          eventId: ctx.event.data.eventId,
        },
      });
    }

    await ctx.step.sendEvent({
      name: 'email/reminder.scheduled',
      data: {
        eventId: ctx.event.data.eventId,
      },
    });
  }
);

export const eventUnpublished = inngest.createFunction(
  {name: 'Event Unpublished'},
  {event: 'event.unpublished'},
  async ({event}) => {
    console.log(event);
  }
);

export const eventRemoved = inngest.createFunction(
  {name: 'Event Removed'},
  {event: 'event.removed'},
  async ({event}) => {
    console.log(event);
  }
);
