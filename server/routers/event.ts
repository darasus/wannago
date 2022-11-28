import {router, publicProcedure, protectedProcedure} from '../trpc';

import {z} from 'zod';
import {prisma} from '../../lib/prisma';
import {nanoid} from 'nanoid';
import {TRPCError} from '@trpc/server';

export const eventRouter = router({
  getEventById: publicProcedure
    .input(
      z.object({
        id: z.string().min(1),
      })
    )
    .query(async ({input}) => {
      return prisma.event.findFirst({
        where: {
          id: input.id,
        },
      });
    }),
  getEventByNanoId: publicProcedure
    .input(
      z.object({
        id: z.string().min(1),
      })
    )
    .query(async ({input}) => {
      return prisma.event.findFirst({
        where: {
          shortId: input.id,
        },
      });
    }),
  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        startDate: z.string(),
        endDate: z.string(),
        address: z.string(),
        featuredImageSrc: z.string(),
        maxNumberOfAttendees: z
          .number()
          .or(z.string())
          .transform((val): number => {
            if (typeof val === 'number') {
              return val;
            }
            return Number(val);
          }),
      })
    )
    .mutation(
      async ({
        input: {
          title,
          description,
          address,
          endDate,
          featuredImageSrc,
          maxNumberOfAttendees,
          startDate,
        },
        ctx,
      }) => {
        return prisma.event.create({
          data: {
            shortId: nanoid(6),
            title,
            description,
            endDate: new Date(startDate).toISOString(),
            startDate: new Date(endDate).toISOString(),
            address: address,
            authorId: ctx.user?.id,
            maxNumberOfAttendees,
            featuredImageSrc,
          },
        });
      }
    ),
  remove: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
      })
    )
    .mutation(async ({input, ctx}) => {
      return prisma.event.delete({
        where: {
          id: input.id,
        },
      });
    }),

  edit: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        title: z.string(),
        description: z.string(),
        startDate: z.string(),
        endDate: z.string(),
        address: z.string(),
        maxNumberOfAttendees: z
          .number()
          .or(z.string())
          .transform((val): number => {
            if (typeof val === 'number') {
              return val;
            }
            return Number(val);
          }),
      })
    )
    .mutation(
      async ({
        input: {
          id,
          address,
          description,
          endDate,
          maxNumberOfAttendees,
          startDate,
          title,
        },
        ctx,
      }) => {
        return prisma.event.update({
          where: {
            id,
          },
          data: {
            title: title,
            description: description,
            startDate: new Date(startDate).toISOString(),
            endDate: new Date(endDate).toISOString(),
            address: address,
            authorId: ctx.user?.id,
            maxNumberOfAttendees: maxNumberOfAttendees,
          },
        });
      }
    ),
  getMyEvents: protectedProcedure.query(async ({ctx}) => {
    const events = await prisma.event.findMany({
      where: {
        authorId: ctx.user?.id,
      },
    });

    return {events};
  }),
});
