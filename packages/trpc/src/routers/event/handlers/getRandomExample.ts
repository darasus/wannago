import {random} from 'utils';
import {publicProcedure} from '../../../trpcServer';

export const getRandomExample = publicProcedure.query(async ({ctx}) => {
  const events = await ctx.prisma.event.findMany({
    where: {
      isPublished: true,
      user: {
        email: {
          in: ['idarase+clerk_test@gmail.com', 'hi+example@wannago.app'],
        },
      },
    },
    include: {
      user: true,
    },
  });

  return random(events);
});
