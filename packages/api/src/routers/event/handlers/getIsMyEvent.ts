import {userNotFoundError, eventNotFoundError} from 'error';
import {invariant} from 'utils';
import {z} from 'zod';
import {publicProcedure} from '../../../trpc';

export const getIsMyEvent = publicProcedure
  .input(
    z.object({
      eventShortId: z.string(),
    })
  )
  .query(async ({input, ctx}) => {
    const user = await ctx.prisma.user.findFirst({
      where: {
        externalId: ctx.auth?.userId,
      },
      include: {
        organization: true,
      },
    });

    invariant(user, userNotFoundError);

    const event = await ctx.prisma.event.findFirst({
      where: {
        shortId: input.eventShortId,
      },
    });

    invariant(event, eventNotFoundError);

    const isMyEvent =
      event.userId === user.id ||
      (Boolean(user.organization?.id) &&
        event.organizationId === user.organization?.id);

    return {isMyEvent};
  });
