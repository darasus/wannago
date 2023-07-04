import {invariant} from 'utils';
import {z} from 'zod';
import {publicProcedure} from '../../../trpc';
import {forbiddenError} from 'error';

export const getIsMyEvent = publicProcedure
  .input(
    z.object({
      eventShortId: z.string(),
    })
  )
  .query(async ({input, ctx}) => {
    const event = await ctx.prisma.event.findFirst({
      where: {
        shortId: input.eventShortId,
        OR: [
          {
            user: {
              externalId: ctx.auth?.userId,
            },
          },
          {
            organization: {
              users: {
                some: {
                  externalId: ctx.auth?.userId,
                },
              },
            },
          },
        ],
      },
    });

    invariant(ctx.auth?.userId && event, forbiddenError);

    return true;
  });
