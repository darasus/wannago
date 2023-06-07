import {serve} from 'inngest/next';
import {EventSchemas, Inngest, InngestMiddleware} from 'inngest';
import {EventsStoreType} from 'types';
import {prisma} from 'database';
import {addDays} from 'date-fns';

const middleware = new InngestMiddleware({
  name: 'Prisma Middleware',
  init() {
    return {
      onFunctionRun(ctx) {
        return {
          transformInput(ctx) {
            return {
              ctx: {
                prisma,
              },
            };
          },
        };
      },
    };
  },
});

const inngest = new Inngest({
  name: 'WannaGo',
  schemas: new EventSchemas().fromRecord<EventsStoreType>(),
  middleware: [middleware],
});

const eventCreated = inngest.createFunction(
  {name: 'Event Created'},
  {event: 'event.created'},
  async ctx => {}
);

const eventUpdated = inngest.createFunction(
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

    const isPaidEvent = event?.tickets && event?.tickets.length > 0;

    if (isPaidEvent) {
      await ctx.step.sendEvent({
        name: 'stripe/payout.scheduled',
        data: {
          eventId: ctx.event.data.eventId,
        },
      });
    }
  }
);

const eventPublished = inngest.createFunction(
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
  }
);

const eventUnpublished = inngest.createFunction(
  {name: 'Event Unpublished'},
  {event: 'event.unpublished'},
  async ({event}) => {
    console.log(event);
  }
);

const eventRemoved = inngest.createFunction(
  {name: 'Event Removed'},
  {event: 'event.removed'},
  async ({event}) => {
    console.log(event);
  }
);

const stripePayoutScheduled = inngest.createFunction(
  {
    name: 'Stripe Payout Scheduled',
    cancelOn: [
      {event: 'event.removed', match: 'data.eventId'},
      {event: 'event.unpublished', match: 'data.eventId'},
      {event: 'event.updated', match: 'data.eventId'},
    ],
  },
  {event: 'stripe/payout.scheduled'},
  async ctx => {
    const event = await ctx.step.run('Fetch event', () =>
      ctx.prisma.event.findUnique({where: {id: ctx.event.data.eventId}})
    );

    if (!event?.endDate) {
      return null;
    }

    const endDate = new Date(event.endDate);
    const payoutDate = addDays(endDate, 7);

    await ctx.step.sleepUntil(payoutDate);

    await ctx.step.run('Schedule payout', () => {
      console.log('PAYOUT!');
    });
  }
);

export default serve(inngest, [
  eventCreated,
  eventUpdated,
  eventPublished,
  eventUnpublished,
  eventRemoved,
  stripePayoutScheduled,
]);
