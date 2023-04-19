import {TRPCError} from '@trpc/server';
import {
  handleEventSignUpEmailInputSchema,
  handleOrganizerEventSignUpNotificationEmailInputSchema,
} from 'email-input-validation';
import {userNotFoundError} from 'error';
import {EmailType} from 'types';
import {invariant} from 'utils';
import {z} from 'zod';
import {protectedProcedure} from '../../../trpcServer';

export const joinEvent = protectedProcedure
  .input(
    z.object({
      eventId: z.string().uuid(),
      hasPlusOne: z.boolean(),
    })
  )
  .mutation(async ({input, ctx}) => {
    const user = await ctx.prisma.user.findFirst({
      where: {
        externalId: ctx.auth.userId,
      },
      include: {
        subscription: true,
        organization: {
          include: {
            subscription: true,
          },
        },
      },
    });

    invariant(user, userNotFoundError);

    const [
      existingSignUp,
      event,
      numberOfRegisteredUsers,
      numberOfInvitedUsers,
    ] = await Promise.all([
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
        include: {
          user: true,
          organization: true,
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
      ctx.prisma.eventSignUp.count({
        where: {
          eventId: input.eventId,
          status: {
            in: ['REGISTERED', 'INVITED'],
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
      numberOfInvitedUsers,
      event,
      organizer: event.user || event.organization,
      subscription: event.user
        ? user.subscription
        : user.organization?.subscription,
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
      ctx.mailQueue.addMessage({
        body: {
          eventId: input.eventId,
          userId: user.id,
          type: EmailType.OrganizerEventSignUpNotification,
        } satisfies z.infer<
          typeof handleOrganizerEventSignUpNotificationEmailInputSchema
        >,
      }),
      ctx.mailQueue.addMessage({
        body: {
          eventId: input.eventId,
          userId: user.id,
          type: EmailType.EventSignUp,
        } satisfies z.infer<typeof handleEventSignUpEmailInputSchema>,
      }),
    ]);

    return {success: true};
  });
