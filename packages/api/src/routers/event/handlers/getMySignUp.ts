import {z} from 'zod';
import {publicProcedure} from '../../../trpc';

export const getMySignUp = publicProcedure
  .input(
    z.object({
      eventId: z.string().uuid(),
    })
  )
  .query(async ({ctx, input}) => {
    if (!ctx.auth?.user?.id) {
      return null;
    }

    return ctx.prisma.eventSignUp.findFirst({
      where: {
        eventId: input.eventId,
        user: {
          id: ctx.auth?.user?.id,
        },
      },
    });
  });
