import {TRPCError} from '@trpc/server';
import {z} from 'zod';
import {protectedProcedure} from '../../../trpc';

export const cancelEventByUserId = protectedProcedure
  .input(
    z.object({
      eventShortId: z.string(),
      userId: z.string().uuid(),
    })
  )
  .mutation(async ({input: {eventShortId, userId}, ctx}) => {
    const signUp = await ctx.prisma.eventSignUp.findFirst({
      where: {
        userId: userId,
        event: {
          shortId: eventShortId,
        },
      },
    });

    if (!signUp) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'User is not signed up for this event',
      });
    }

    return ctx.prisma.eventSignUp.update({
      where: {
        id: signUp.id,
      },
      data: {
        status: 'CANCELLED',
      },
    });
  });
