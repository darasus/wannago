import {z} from 'zod';
import {publicProcedure} from '../../../trpcServer';

export const getMySignUp = publicProcedure
  .input(
    z.object({
      eventId: z.string().uuid(),
    })
  )
  .query(async ({ctx, input}) => {
    if (!ctx.auth?.userId) {
      return null;
    }

    return ctx.prisma.eventSignUp.findFirst({
      where: {
        eventId: input.eventId,
        user: {
          externalId: ctx.auth?.userId,
        },
      },
    });
  });
