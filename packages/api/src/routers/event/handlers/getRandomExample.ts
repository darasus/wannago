import {exampleEventIds} from 'const';
import {isPast, random} from 'utils';
import {publicProcedure} from '../../../trpc';

export const getRandomExample = publicProcedure.query(async ({ctx}) => {
  const events = await ctx.prisma.event.findMany({
    where: {
      isPublished: true,
      shortId: {
        in: exampleEventIds,
      },
    },
    include: {
      user: true,
      organization: true,
      tickets: true,
      eventSignUps: true,
      ticketSales: true,
    },
  });

  const event = random(events);

  return {...event, isPast: isPast(event.endDate, ctx.timezone)};
});
