import {publicProcedure} from '../../trpcServer';

export const getCurrency = publicProcedure.query(async ({ctx}) => {
  return ctx.currency;
});
