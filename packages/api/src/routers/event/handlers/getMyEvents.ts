import {protectedProcedure} from '../../../trpc';

export const getMyEvents = protectedProcedure.query(async ({ctx, input}) => {
  return ctx.prisma.event.findMany();
});
