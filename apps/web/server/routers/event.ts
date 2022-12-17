import {router, protectedProcedure, publicProcedure} from '../trpc';
import {z} from 'zod';
import {nanoid} from 'nanoid';
import {TRPCError} from '@trpc/server';
import {User} from '@prisma/client';
import {differenceInSeconds} from 'date-fns';
import {authorizeChange} from '../../utils/getIsMyEvent';

const publish = protectedProcedure
  .input(z.object({isPublished: z.boolean(), eventId: z.string()}))
  .mutation(async ({input, ctx}) => {
    await authorizeChange({ctx, eventId: input.eventId});

    return ctx.prisma.event.update({
      where: {id: input.eventId},
      data: {
        isPublished: input.isPublished,
      },
    });
  });

const update = protectedProcedure
  .input(
    z.object({
      eventId: z.string().uuid(),
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
        eventId,
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
      await authorizeChange({ctx, eventId});

      const response = await ctx.googleMaps.geocode({
        params: {
          key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
          address,
        },
      });

      let event = await ctx.prisma.event.update({
        where: {
          id: eventId,
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

      const message = await ctx.qStash.updateEventEmailSchedule({
        event,
        isTimeChanged: differenceInSeconds(startDate, event.startDate) !== 0,
      });

      if (message?.messageId) {
        event = await ctx.prisma.event.update({
          where: {
            id: eventId,
          },
          data: {
            messageId: message.messageId,
          },
        });
      }

      return event;
    }
  );

const remove = protectedProcedure
  .input(
    z.object({
      eventId: z.string().min(1),
    })
  )
  .mutation(async ({input: {eventId}, ctx}) => {
    await authorizeChange({ctx, eventId});

    return ctx.prisma.event.delete({
      where: {
        id: eventId,
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

      let event = await ctx.prisma.event.create({
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

      const message = await ctx.qStash.createEventEmailSchedule({
        event,
      });

      if (message?.messageId) {
        event = await ctx.prisma.event.update({
          where: {
            id: event.id,
          },
          data: {
            messageId: message.messageId,
          },
        });
      }

      return event;
    }
  );

const getById = protectedProcedure
  .input(
    z.object({
      eventId: z.string().min(1),
    })
  )
  .query(async ({input: {eventId}, ctx}) => {
    await authorizeChange({ctx, eventId});

    return ctx.prisma.event.findFirst({
      where: {
        id: eventId,
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
  .mutation(async ({input: {eventId, userId}, ctx}) => {
    await authorizeChange({ctx, eventId});

    return ctx.prisma.event.update({
      where: {
        id: eventId,
      },
      data: {
        attendees: {
          disconnect: {
            id: userId,
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
  .query(async ({input: {eventId}, ctx}) => {
    await authorizeChange({ctx, eventId});

    return ctx.prisma.user.findMany({
      where: {
        attendingEvents: {
          some: {
            id: eventId,
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
