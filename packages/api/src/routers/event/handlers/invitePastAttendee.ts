import {TRPCError} from '@trpc/server';
import {handleEventInviteEmailInputSchema} from 'email-input-validation';
import {eventNotFoundError} from 'error';
import {EmailType} from 'types';
import {invariant} from 'utils';
import {z} from 'zod';
import {protectedProcedure} from '../../../trpc';

export const invitePastAttendee = protectedProcedure
  .input(
    z.object({
      userId: z.string().uuid(),
      eventShortId: z.string(),
    })
  )
  .mutation(async ({ctx, input}) => {
    const event = await ctx.prisma.event.findFirst({
      where: {
        shortId: input.eventShortId,
      },
    });

    invariant(event, eventNotFoundError);

    const eventSignUp = await ctx.prisma.eventSignUp.findFirst({
      where: {
        userId: input.userId,
        eventId: event.id,
      },
    });

    if (event.isPublished === false) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: `You can't invite user to unpublished event. Please publish first.`,
      });
    }

    if (eventSignUp?.status === 'REGISTERED') {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'User is already signed up for this event',
      });
    }

    if (eventSignUp?.status === 'INVITED') {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'User is already invited for this event',
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

    const invite = await ctx.prisma.eventSignUp.create({
      data: {
        status: 'INVITED',
        eventId: event.id,
        userId: input.userId,
      },
    });

    await ctx.mailQueue.addMessage({
      body: {
        eventId: event.id,
        userId: input.userId,
        type: EmailType.EventInvite,
      } satisfies z.infer<typeof handleEventInviteEmailInputSchema>,
    });

    return invite;
  });
