import {exampleEventIds} from 'const';
import {isPast, random} from 'utils';
import {publicProcedure} from '../../../trpc';
import {UserType} from '@prisma/client';

export const getRandomExample = publicProcedure.query(async ({ctx}) => {
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

  const event = random(events);

  return {
    ...event,
    isPast: isPast(event.endDate, ctx.timezone),
    isMyEvent: ctx.auth?.user.type === UserType.ADMIN,
  };
});
