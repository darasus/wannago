import {z} from 'zod';
import {publicProcedure} from '../../../trpc';

export const getIsMyEvent = publicProcedure
  .input(
    z.object({
      eventShortId: z.string(),
    })
  )
  .query(async ({input, ctx}) => {
    if (!ctx.auth?.user?.id) {
      return false;
    }

    const event = await ctx.prisma.event.findFirst({
      where: {
        shortId: input.eventShortId,
        OR: [
          {
            user: {
              id: ctx.auth?.user?.id,
            },
          },
          {
            organization: {
              users: {
                some: {
                  id: ctx.auth?.user?.id,
                },
              },
            },
          },
        ],
      },
    });

    return !!event;
  });
