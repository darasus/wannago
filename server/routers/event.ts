import {router, protectedProcedure, publicProcedure} from '../trpc';
import {z} from 'zod';
import {nanoid} from 'nanoid';
import {Client} from '@googlemaps/google-maps-services-js';
import {TRPCError} from '@trpc/server';
import {User} from '@prisma/client';

const publish = protectedProcedure
  .input(z.object({isPublished: z.boolean(), eventId: z.string()}))
  .mutation(async ({input, ctx}) => {
    const event = await ctx.prisma.event.update({
      where: {id: input.eventId},
      data: {
        isPublished: input.isPublished,
      },
    });

    const message = await ctx.qStash.scheduleEventEmail({event});

    return ctx.prisma.event.update({
      where: {id: input.eventId},
      data: {
        messageId: message.messageId,
      },
    });
  });

const update = protectedProcedure
  .input(
    z.object({
      id: z.string().uuid(),
      title: z.string(),
      description: z.string(),
      startDate: z.date(),
      endDate: z.date(),
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
        startDate,
        endDate,
        maxNumberOfAttendees,
        featuredImageSrc,
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

      const event = await ctx.prisma.event.update({
        where: {
          id,
        },
        data: {
          title: title,
          description: description,
          startDate,
          endDate,
          address: address,
          maxNumberOfAttendees: maxNumberOfAttendees,
          featuredImageSrc,
          longitude: response.data.results[0].geometry.location.lng,
          latitude: response.data.results[0].geometry.location.lat,
        },
      });

      const message = await ctx.qStash.updateEventEmailSchedule({event});

      return ctx.prisma.event.update({
        where: {
          id,
        },
        data: {
          messageId: message.messageId,
        },
      });
    }
  );

const remove = protectedProcedure
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
  });

const create = protectedProcedure
  .input(
    z.object({
      title: z.string(),
      description: z.string(),
      startDate: z.date(),
      endDate: z.date(),
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
          endDate,
          startDate,
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
  );

const getById = publicProcedure
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
  });

const getByShortId = publicProcedure
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
  });

const getOrganizer = publicProcedure
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
  });

const join = publicProcedure
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

    await ctx.mail.sendEventSignupEmail({
      event,
      user,
    });

    return event;
  });

const removeUser = protectedProcedure
  .input(
    z.object({
      eventId: z.string().uuid(),
      userId: z.string().uuid(),
    })
  )
  .mutation(async ({ctx, input}) => {
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
  });

const getNumberOfAttendees = publicProcedure
  .input(z.object({eventId: z.string().uuid()}))
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
  });

const getAttendees = protectedProcedure
  .input(z.object({eventId: z.string().uuid()}))
  .query(({input, ctx}) => {
    return ctx.prisma.user.findMany({
      where: {
        attendingEvents: {
          some: {
            id: input.eventId,
          },
        },
      },
    });
  });

export const eventRouter = router({
  create,
  remove,
  update,
  publish,
  getById,
  getByShortId,
  getOrganizer,
  join,
  removeUser,
  getNumberOfAttendees,
  getAttendees,
});
