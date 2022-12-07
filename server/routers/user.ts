import {router, protectedProcedure} from '../trpc';
import {z} from 'zod';

export const userRouter = router({
  setupUser: protectedProcedure
    .input(
      z.object({
        email: z.string(),
        firstName: z.string(),
        lastName: z.string(),
      })
    )
    .mutation(async ({input, ctx}) => {
      return ctx.prisma.user.create({
        data: {
          email: input.email,
          firstName: input.firstName,
          lastName: input.lastName,
          externalId: ctx.user.id,
          organization: {
            create: {},
          },
        },
      });
    }),
});
