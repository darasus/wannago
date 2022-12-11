import {router, protectedProcedure} from '../trpc';
import {z} from 'zod';
import {nanoid} from 'nanoid';
import {Client} from '@googlemaps/google-maps-services-js';
import {TRPCError} from '@trpc/server';
import {sub, differenceInSeconds, differenceInMinutes} from 'date-fns';

export const eventManagerRouter = router({
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
        const response = await ctx.googleMaps.geocode({
          params: {
            key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
            address,
          },
        });

        const organization = await ctx.prisma.organization.findFirst({
          where: {
            users: {
              some: {
                externalId: ctx.user?.id,
              },
            },
          },
        });

        if (!organization) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'No organization found',
          });
        }

        const event = await ctx.prisma.event.create({
          data: {
            shortId: nanoid(6),
            title,
            description,
            endDate: new Date(startDate).toISOString(),
            startDate: new Date(endDate).toISOString(),
            address: address,
            maxNumberOfAttendees,
            featuredImageSrc,
            longitude: response.data.results[0].geometry.location.lng,
            latitude: response.data.results[0].geometry.location.lat,
            organization: {
              connect: {
                id: organization.id,
              },
            },
          },
        });

        return event;
      }
    ),

  remove: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
      })
    )
    .mutation(async ({input, ctx}) => {
      return ctx.prisma.event.delete({
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
          id,
          address,
          description,
          endDate,
          maxNumberOfAttendees,
          featuredImageSrc,
          startDate,
          title,
        },
        ctx,
      }) => {
        const client = new Client();

        const response = await client.geocode({
          params: {
            key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
            address,
          },
        });

        return ctx.prisma.event.update({
          where: {
            id,
          },
          data: {
            title: title,
            description: description,
            startDate: new Date(startDate).toISOString(),
            endDate: new Date(endDate).toISOString(),
            address: address,
            maxNumberOfAttendees: maxNumberOfAttendees,
            featuredImageSrc,
            longitude: response.data.results[0].geometry.location.lng,
            latitude: response.data.results[0].geometry.location.lat,
          },
        });
      }
    ),

  publishEvent: protectedProcedure
    .input(z.object({isPublished: z.boolean(), eventId: z.string()}))
    .mutation(async ({input, ctx}) => {
      const event = await ctx.prisma.event.update({
        where: {id: input.eventId},
        data: {
          isPublished: input.isPublished,
        },
      });

      await ctx.qStash.scheduleEventEmail({
        eventId: event.id,
        startDate: event.startDate,
      });

      return event;
    }),
});
