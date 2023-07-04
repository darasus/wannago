import {z} from 'zod';
import {publicProcedure} from '../../../trpc';

export const getIsMyEvent = publicProcedure
  .input(
    z.object({
      eventShortId: z.string(),
    })
  )
  .query(async ({input, ctx}) => {
    if (!ctx.auth?.userId) {
      return false;
    }

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

    return !!event;
  });
