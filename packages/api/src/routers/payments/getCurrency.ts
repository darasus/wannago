import {publicProcedure} from '../../trpc';

export const getCurrency = publicProcedure.query(async ({ctx}) => {
  return ctx.currency;
});
