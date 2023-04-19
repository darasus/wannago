import {z} from 'zod';
import {publicProcedure} from '../../../trpcServer';

export const getNumberOfAttendees = publicProcedure
  .input(z.object({eventId: z.string().uuid()}))
  .query(async ({input: {eventId}, ctx}) => {
    const signUps = await ctx.prisma.eventSignUp.findMany({
      where: {
        eventId,
        status: 'REGISTERED',
      },
    });

    return {
      count: signUps.reduce((acc, next) => {
        if (next.hasPlusOne) {
          return acc + 2;
        }

        return acc + 1;
      }, 0),
    };
  });
