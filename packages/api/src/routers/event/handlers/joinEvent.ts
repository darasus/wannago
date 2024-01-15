import {TRPCError} from '@trpc/server';
import {userNotFoundError} from 'error';
import {invariant} from 'utils';
import {z} from 'zod';
import {protectedProcedure} from '../../../trpc';

export const joinEvent = protectedProcedure
  .input(
    z.object({
      eventId: z.string().uuid(),
      hasPlusOne: z.boolean(),
      code: z.string().optional(),
    })
  )
  .mutation(async ({input, ctx}) => {
    const user = await ctx.prisma.user.findFirst({
      where: {
        id: ctx.auth?.user?.id,
      },
    });

    invariant(user, userNotFoundError);

    const [existingSignUp, event, numberOfRegisteredUsers] = await Promise.all([
      ctx.prisma.eventSignUp.findFirst({
        where: {
          eventId: input.eventId,
          userId: user.id,
        },
      }),
      ctx.prisma.event.findFirst({
        where: {
          id: input.eventId,
        },
      }),
      ctx.prisma.eventSignUp.count({
        where: {
          eventId: input.eventId,
          status: {
            in: ['REGISTERED'],
          },
        },
      }),
    ]);

    if (!event?.isPublished) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Event is not published yet.',
      });
    }

    if (existingSignUp && existingSignUp.status === 'REGISTERED') {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'You are already signed up for this event.',
      });
    }

    ctx.assertions.assertCanJoinEvent({
      numberOfRegisteredUsers,
      event,
      code: input.code,
    });

    if (!existingSignUp) {
      await ctx.prisma.eventSignUp.create({
        data: {
          hasPlusOne: input.hasPlusOne,
          event: {
            connect: {
              id: input.eventId,
            },
          },
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      });
    }

    if (
      existingSignUp &&
      (existingSignUp.status === 'CANCELLED' ||
        existingSignUp.status === 'INVITED')
    ) {
      await ctx.prisma.eventSignUp.update({
        where: {
          id: existingSignUp.id,
        },
        data: {
          hasPlusOne: input.hasPlusOne,
          status: 'REGISTERED',
        },
      });
    }

    await Promise.all([
      await ctx.inngest.send({
        name: 'email/organizer.event.sign.up.notification',
        data: {
          eventId: input.eventId,
          userId: user.id,
        },
      }),
      await ctx.inngest.send({
        name: 'email/event.sign.up',
        data: {
          eventId: input.eventId,
          userId: user.id,
        },
      }),
    ]);

    return {success: true};
  });
