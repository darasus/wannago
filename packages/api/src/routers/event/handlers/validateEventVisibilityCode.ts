import {z} from 'zod';
import {publicProcedure} from '../../../trpc';

export const validateEventVisibilityCode = publicProcedure
  .input(z.object({id: z.string(), code: z.string().min(1)}))
  .query(async ({ctx, input}) => {
    const event = await ctx.prisma.event.findUnique({
      where: {
        shortId: input.id,
        eventVisibilityCode: input.code,
      },
    });

    return Boolean(event);
  });
