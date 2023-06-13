import {exampleEventIds} from 'const';
import {random} from 'utils';
import {publicProcedure} from '../../../trpcServer';

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

  return random(events);
});
