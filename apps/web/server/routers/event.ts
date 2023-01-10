import {router, protectedProcedure, publicProcedure} from '../trpc';
import {z} from 'zod';
import {nanoid} from 'nanoid';
import {TRPCError} from '@trpc/server';
import {EventRegistrationStatus, User} from '@prisma/client';
import {differenceInSeconds} from 'date-fns';
import {authorizeChange} from '../../utils/getIsMyEvent';
import {random} from '../../utils/random';
import {env} from '../../lib/env/server';

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

      const response = await ctx.maps.geocode({address});

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
          longitude: response.results[0].geometry.location.lng,
          latitude: response.results[0].geometry.location.lat,
        },
      });

      const isTimeChanged =
        differenceInSeconds(startDate, event.startDate) !== 0;

      if (isTimeChanged) {
        const message = await ctx.qStash.updateEventEmailSchedule({
          event,
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
      const response = await ctx.maps.geocode({address});

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
          longitude: response.results[0].geometry.location.lng,
          latitude: response.results[0].geometry.location.lat,
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
      include: {
        organization: {
          include: {
            users: true,
          },
        },
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
      hasPlusOne: z.boolean(),
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

    const existingSignUp = await ctx.prisma.eventSignUp.findFirst({
      where: {
        eventId: input.eventId,
        userId: user.id,
      },
    });

    if (!existingSignUp) {
      await ctx.prisma.eventSignUp.create({
        data: {
          hasPlusOne: input.hasPlusOne,
          event: {
            connect: {
              id: input.eventId,
            },
          },
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      });
    }

    await ctx.mail.sendEventSignupEmail({
      eventId: input.eventId,
      userId: user.id,
    });

    return {success: true};
  });

const cancelRsvp = protectedProcedure
  .input(
    z.object({
      eventId: z.string().uuid(),
      userId: z.string().uuid(),
    })
  )
  .mutation(async ({input: {eventId, userId}, ctx}) => {
    await authorizeChange({ctx, eventId});

    const signUp = await ctx.prisma.eventSignUp.findFirst({
      where: {
        userId: userId,
        eventId: eventId,
      },
    });

    if (!signUp) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'User is not signed up for this event',
      });
    }

    return ctx.prisma.eventSignUp.update({
      where: {
        id: signUp.id,
      },
      data: {
        status: 'CANCELLED',
      },
    });
  });

const getNumberOfAttendees = publicProcedure
  .input(z.object({eventId: z.string().uuid()}))
  .query(async ({input: {eventId}, ctx}) => {
    const signUps = await ctx.prisma.eventSignUp.findMany({
      where: {
        eventId,
      },
    });

    return {
      count: signUps.reduce((acc, next) => {
        if (next.hasPlusOne) {
          return acc + 2;
        }

        return acc + 1;
      }, 0),
    };
  });

const getAttendees = protectedProcedure
  .input(z.object({eventId: z.string().uuid()}))
  .query(async ({input: {eventId}, ctx}) => {
    await authorizeChange({ctx, eventId});

    return ctx.prisma.eventSignUp.findMany({
      where: {
        eventId,
      },
      include: {
        user: true,
      },
    });
  });

const getExamples = publicProcedure.query(({ctx}) => {
  return ctx.prisma.event.findMany({
    where: {
      isPublished: true,
      organization: {
        users: {
          some: {
            email: 'hi+example@wannago.app',
          },
        },
      },
    },
  });
});

const getRandomExample = publicProcedure.query(async ({ctx}) => {
  const events = await ctx.prisma.event.findMany({
    where: {
      isPublished: true,
      organization: {
        users: {
          some: {
            email:
              env.NODE_ENV === 'development'
                ? 'idarase+clerk_test@gmail.com'
                : 'hi+example@wannago.app',
          },
        },
      },
    },
    include: {
      organization: {
        include: {
          users: true,
        },
      },
    },
  });

  return random(events);
});

const getAllEventsAttendees = protectedProcedure
  .input(
    z.object({
      eventId: z.string().uuid(),
    })
  )
  .query(async ({ctx, input}) => {
    const organization = await ctx.prisma.organization.findFirst({
      where: {
        users: {
          some: {
            externalId: ctx.user.id,
          },
        },
      },
    });

    const eventSignUps = await ctx.prisma.eventSignUp.findMany({
      where: {
        event: {
          organizationId: organization?.id,
        },
      },
      include: {
        user: true,
      },
    });

    const userMap: Record<
      string,
      User & {status: EventRegistrationStatus | null}
    > = {};

    for (const eventSignUp of eventSignUps) {
      if (!userMap[eventSignUp.userId]) {
        userMap[eventSignUp.userId] = {
          ...eventSignUp.user,
          status: null,
        };
      }

      if (eventSignUp.eventId === input.eventId) {
        userMap[eventSignUp.userId].status = eventSignUp.status;
      }
    }

    return Object.values(userMap);
  });

const invitePastAttendee = protectedProcedure
  .input(
    z.object({
      userId: z.string().uuid(),
      eventId: z.string().uuid(),
    })
  )
  .mutation(async ({ctx, input}) => {
    const eventSignUp = await ctx.prisma.eventSignUp.findFirst({
      where: {
        userId: input.userId,
        eventId: input.eventId,
      },
    });

    if (eventSignUp?.status === 'REGISTERED') {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'User is already signed up for this event',
      });
    }

    if (eventSignUp?.status === 'INVITED') {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'User is already invited for this event',
      });
    }

    return ctx.prisma.eventSignUp.create({
      data: {
        status: 'INVITED',
        eventId: input.eventId,
        userId: input.userId,
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
  cancelRsvp,
  getNumberOfAttendees,
  getAttendees,
  getExamples,
  getRandomExample,
  getAllEventsAttendees,
  invitePastAttendee,
});
