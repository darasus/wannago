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

      await ctx.mailgun.messages.create('email.wannago.app', messageData);

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

  getEventOrganizer: publicProcedure
    .input(z.object({eventId: z.string().uuid()}))
    .query(async ({input, ctx}) => {
      return ctx.prisma.user.findFirst({
        where: {
          organization: {
            events: {
              some: {
                id: input.eventId,
              },
            },
          },
        },
      });
    }),
});
