import {z} from 'zod';
import {protectedProcedure} from '../../../trpc';
import {canModifyEvent} from '../../../actions/canModifyEvent';
import {assertCanPublishEvent} from '../../../assertions/assertCanPublishEvent';

export const publish = protectedProcedure
  .input(z.object({isPublished: z.boolean(), eventId: z.string()}))
  .mutation(async ({input, ctx}) => {
    await canModifyEvent(ctx)({eventId: input.eventId});

    if (input.isPublished === true) {
      await assertCanPublishEvent(ctx)({eventId: input.eventId});
    }

    const result = await ctx.prisma.event.update({
      where: {id: input.eventId},
      data: {
        isPublished: input.isPublished,
      },
    });

    if (input.isPublished === true) {
      await ctx.inngest.send({
        name: 'event.published',
        data: {eventId: input.eventId},
      });
    }

    if (input.isPublished === false) {
      await ctx.inngest.send({
        name: 'event.unpublished',
        data: {eventId: input.eventId},
      });
    }

    return result;
  });
