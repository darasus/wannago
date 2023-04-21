import {z} from 'zod';
import {protectedProcedure} from '../../../trpcServer';

export const generateImageWithEventTitle = protectedProcedure
  .input(
    z.object({
      eventTitle: z.string(),
    })
  )
  .mutation(async ({input, ctx}) => {
    return ctx.actions.generateImageFromEventTitle({
      eventTitle: input.eventTitle,
    });
  });
