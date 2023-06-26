import {z} from 'zod';
import {protectedProcedure} from '../../../trpc';

export const generateImageWithPrompt = protectedProcedure
  .input(
    z.object({
      prompt: z.string(),
    })
  )
  .mutation(async ({input, ctx}) => {
    return ctx.actions.generateImageFromPrompt({
      prompt: input.prompt,
    });
  });
