import {TRPCError} from '@trpc/server';
import {userNotFoundError} from 'error';
import {invariant} from 'utils';
import {z} from 'zod';
import {protectedProcedure} from '../../../trpc';

export const cancelEvent = protectedProcedure
  .input(
    z.object({
      eventId: z.string().uuid(),
    })
  )
  .mutation(async ({input: {eventId}, ctx}) => {
    const user = await ctx.prisma.user.findFirst({
      where: {
        externalId: ctx.auth.userId,
      },
    });

    invariant(user, userNotFoundError);

    const signUp = await ctx.prisma.eventSignUp.findFirst({
      where: {
        userId: user.id,
        eventId: eventId,
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
