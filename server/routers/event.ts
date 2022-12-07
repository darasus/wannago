import {router, publicProcedure, protectedProcedure} from '../trpc';
import {z} from 'zod';
import {nanoid} from 'nanoid';
import {Client} from '@googlemaps/google-maps-services-js';
import {prisma, User} from '@prisma/client';
import {MailgunMessageData} from 'mailgun.js/interfaces/Messages';
import ReactRender from 'react-dom/server';
import {EventView} from '../../components/EventView/EventView';
import {createEventSubscribeEmailTemplate} from '../../utils/createEventSubscribeEmailTemplate';
import {TRPCError} from '@trpc/server';

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

        return ctx.prisma.event.create({
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
  getMyEvents: protectedProcedure.query(async ({ctx}) => {
    const events = await ctx.prisma.event.findMany({
      where: {
        organization: {
          users: {
            some: {
              externalId: ctx.user?.id,
            },
          },
        },
      },
    });

    return {events};
  }),
  rsvp: publicProcedure
    .input(
      z.object({
        eventId: z.string(),
        email: z.string().email('Is not valid email'),
        firstName: z.string(),
        lastName: z.string(),
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
            firstName: input.firstName,
            lastName: input.lastName,
            externalId: null,
            organization: {
              create: {},
            },
          },
        });
      }

      if (!user.firstName || !user.lastName) {
        await ctx.prisma.user.update({
          where: {id: user.id},
          data: {
            firstName: input.firstName,
            lastName: input.lastName,
          },
        });
      }

      const event = await ctx.prisma.event.update({
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

      const messageData: MailgunMessageData = {
        from: 'WannaGo Team <hi@wannago.app>',
        to: input.email,
        subject: `Thanks for signing up for "${event.title}"!`,
        html: createEventSubscribeEmailTemplate(event),
      };

      await ctx.mailgun.messages
        .create('email.wannago.app', messageData)
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.error(err);
        });

      return event;
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
          organization: {
            users: {
              some: {
                externalId: ctx.user?.id,
              },
            },
          },
        },
        include: {
          attendees: true,
        },
      });

      return event?.attendees || [];
    }),
  deleteAttendee: protectedProcedure
    .input(z.object({eventId: z.string().uuid(), userId: z.string().uuid()}))
    .mutation(async ({input, ctx}) => {
      const event = await ctx.prisma.event.findFirst({
        where: {
          id: input.eventId,
        },
        include: {
          attendees: true,
        },
      });

      return ctx.prisma.event.update({
        where: {
          id: input.eventId,
        },
        data: {
          attendees: {
            disconnect: {
              id: input.userId,
            },
          },
        },
      });
    }),
  publishEvent: protectedProcedure
    .input(z.object({isPublished: z.boolean(), eventId: z.string()}))
    .mutation(async ({input, ctx}) => {
      return ctx.prisma.event.update({
        where: {id: input.eventId},
        data: {
          isPublished: input.isPublished,
        },
      });
    }),
});
