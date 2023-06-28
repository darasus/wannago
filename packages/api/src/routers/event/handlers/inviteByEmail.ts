import {User} from '@prisma/client';
import {TRPCError} from '@trpc/server';
import {eventNotFoundError} from 'error';
import {invariant} from 'utils';
import {z} from 'zod';
import {protectedProcedure} from '../../../trpc';

export const inviteByEmail = protectedProcedure
  .input(
    z.object({
      eventShortId: z.string(),
      email: z.string().email('Is not valid email'),
      firstName: z.string(),
      lastName: z.string(),
    })
  )
  .mutation(async ({input, ctx}) => {
    const event = await ctx.prisma.event.findFirst({
      where: {
        shortId: input.eventShortId,
      },
    });

    invariant(event, eventNotFoundError);

    await ctx.actions.canModifyEvent({eventId: event.id});

    let user: User | null = null;

    user = await ctx.prisma.user.findUnique({
      where: {
        email: input.email,
      },
    });

    if (!user) {
      user = await ctx.prisma.user.create({
        data: {
          email: input.email,
          firstName: input.firstName,
          lastName: input.lastName,
          externalId: null,
          preferredCurrency: 'USD',
        },
      });
    }

    const existingSignUp = await ctx.prisma.eventSignUp.findFirst({
      where: {
        eventId: event.id,
        userId: user.id,
      },
    });

    if (existingSignUp) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'User is already signed up for this event',
      });
    }

    const eventSignUpsCount = await ctx.prisma.eventSignUp.count({
      where: {
        eventId: event.id,
        status: {
          in: ['REGISTERED', 'INVITED'],
        },
      },
    });

    if (
      typeof event?.maxNumberOfAttendees === 'number' &&
      eventSignUpsCount >= event?.maxNumberOfAttendees &&
      event?.maxNumberOfAttendees !== 0
    ) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Event is full and no longer accepts sign ups.',
      });
    }

    await ctx.prisma.eventSignUp.create({
      data: {
        event: {
          connect: {
            id: event.id,
          },
        },
        status: 'INVITED',
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    await ctx.inngest.send({
      name: 'email/event.invite',
      data: {
        eventId: event.id,
        userId: user.id,
      },
    });

    return {success: true};
  });
