import {exampleEventIds} from 'const';
import {publicProcedure} from '../../../trpc';
import {isPast} from 'utils';

export const getExamples = publicProcedure.query(async ({ctx}) => {
  const events = await ctx.prisma.event.findMany({
    where: {
      isPublished: true,
      shortId: {
        in: exampleEventIds,
      },
    },
    include: {
      tickets: true,
      eventSignUps: true,
      ticketSales: true,
    },
  });

  return events.map((event) => ({
    ...event,
    isPast: isPast(event.endDate, ctx.timezone),
  }));
});
