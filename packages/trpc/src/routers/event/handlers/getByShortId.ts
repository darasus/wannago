import {z} from 'zod';
import {publicProcedure} from '../../../trpcServer';

export const getByShortId = publicProcedure
  .input(
    z.object({
      id: z.string().min(1),
    })
  )
  .query(async ({input, ctx}) => {
    return ctx.prisma.event.findFirst({
      where: {
        shortId: input.id,
      },
      include: {
        organization: {
          include: {
            users: true,
          },
        },
        user: true,
      },
    });
  });
