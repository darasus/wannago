import {random} from 'utils';
import {publicProcedure} from '../../../trpcServer';

export const getRandomExample = publicProcedure.query(async ({ctx}) => {
  const events = await ctx.prisma.event.findMany({
    where: {
      isPublished: true,
      shortId: {
        // TODO: find more examples
        in: ['pg15re'],
      },
    },
    include: {
      user: true,
      organization: true,
    },
  });

  return random(events);
});
