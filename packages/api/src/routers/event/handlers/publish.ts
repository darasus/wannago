import {z} from 'zod';
import {protectedProcedure} from '../../../trpc';

export const publish = protectedProcedure
  .input(z.object({isPublished: z.boolean(), eventId: z.string()}))
  .mutation(async ({input, ctx}) => {
    await ctx.assertions.assertCanModifyEvent({eventId: input.eventId});

    if (input.isPublished === true) {
      await ctx.assertions.assertCanPublishEvent({eventId: input.eventId});
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
