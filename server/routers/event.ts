import {router, publicProcedure, protectedProcedure} from '../trpc';
import {z} from 'zod';
import {nanoid} from 'nanoid';
import {Client} from '@googlemaps/google-maps-services-js';
import {User} from '@prisma/client';

export const eventRouter = router({
  getEventById: publicProcedure
    .input(
      z.object({
        id: z.string().min(1),
      })
    )
    .query(async ({input, ctx}) => {
      return ctx.prisma.event.findFirst({
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
    .query(async ({input, ctx}) => {
      return ctx.prisma.event.findFirst({
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
        const client = new Client();

        const response = await client.geocode({
          params: {
            key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
            address,
          },
        });

        return ctx.prisma.event.create({
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
            longitude: response.data.results[0].geometry.location.lng,
            latitude: response.data.results[0].geometry.location.lat,
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
            authorId: ctx.user?.id,
            maxNumberOfAttendees: maxNumberOfAttendees,
            featuredImageSrc,
            longitude: response.data.results[0].geometry.location.lng,
            latitude: response.data.results[0].geometry.location.lat,
          },
        });
      }
    ),
  getMyEvents: protectedProcedure.query(async ({ctx}) => {
    const events = await ctx.prisma.event.findMany({
      where: {
        authorId: ctx.user?.id,
      },
    });

    return {events};
  }),
  rsvp: publicProcedure
    .input(
      z.object({
        eventId: z.string(),
        email: z.string().email('Is not valid email'),
      })
    )
    .mutation(async ({input, ctx}) => {
      let user: User | null = null;
      user = await ctx.prisma.user.findUnique({
        where: {
          email: input.email,
        },
      });

      if (!user) {
        user = await ctx.prisma.user.create({
          data: {
            email: input.email,
          },
        });
      }

      return ctx.prisma.event.update({
        where: {
          id: input.eventId,
        },
        data: {
          attendees: {
            connect: {
              id: user.id,
            },
          },
        },
      });
    }),
  getNumberOfAttendees: publicProcedure
    .input(z.object({eventId: z.string()}))
    .query(async ({input, ctx}) => {
      const count = await ctx.prisma.user.count({
        where: {
          attendingEvents: {
            some: {
              id: input.eventId,
            },
          },
        },
      });

      return {count};
    }),
  attendees: protectedProcedure
    .input(z.object({eventId: z.string()}))
    .query(async ({input, ctx}) => {
      const event = await ctx.prisma.event.findFirst({
        where: {
          id: input.eventId,
          authorId: ctx.user?.id,
        },
        include: {
          attendees: true,
        },
      });

      return event?.attendees || [];
    }),
});
