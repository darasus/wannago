import {env} from 'server-env';
import {getBaseUrl} from 'utils';
import {z} from 'zod';
import {protectedProcedure} from '../../../trpcServer';

export const publish = protectedProcedure
  .input(z.object({isPublished: z.boolean(), eventId: z.string()}))
  .mutation(async ({input, ctx}) => {
    await ctx.actions.canModifyEvent({eventId: input.eventId});

    const result = await ctx.prisma.event.update({
      where: {id: input.eventId},
      data: {
        isPublished: input.isPublished,
      },
    });

    if (result.isPublished && env.VERCEL_ENV === 'production') {
      const user = await ctx.prisma.user.findFirst({
        where: {
          externalId: ctx.auth.userId,
        },
      });

      await ctx.telegram
        .sendMessageToWannaGoChannel({
          message: `${user?.firstName} ${user?.lastName} published event "${
            result.title
          }" ${getBaseUrl()}/e/${result.shortId}`,
        })
        .catch(console.error);
    }

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
