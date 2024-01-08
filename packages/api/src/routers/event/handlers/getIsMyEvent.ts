import {z} from 'zod';
import {publicProcedure} from '../../../trpc';
import {UserType} from '@prisma/client';

export const getIsMyEvent = publicProcedure
  .input(
    z.object({
      eventShortId: z.string(),
    })
  )
  .query(async ({input, ctx}) => {
    return ctx.auth?.user?.type === UserType.ADMIN;
  });
