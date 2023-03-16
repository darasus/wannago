import {router, protectedProcedure, publicProcedure} from '../trpcServer';
import {z} from 'zod';
import {nanoid} from 'nanoid';
import {TRPCError} from '@trpc/server';
import {EventRegistrationStatus, User} from '@prisma/client';
import {differenceInSeconds} from 'date-fns';
import {authorizeChange} from '../../../../apps/web/src/utils/authorizeChange';
import {random, getBaseUrl} from 'utils';
import {env} from 'server-env';
import {utcToZonedTime} from 'date-fns-tz';

const eventInput = z.object({
  title: z.string(),
  description: z.string().nullable().default(null),
  startDate: z.date(),
  endDate: z.date(),
  address: z.string().nullable().default(null),
  streamUrl: z.string().nullable(),
  featuredImageSrc: z.string().nullable().default(null),
  featuredImageHeight: z.number().nullable().default(null),
  featuredImageWidth: z.number().nullable().default(null),
  featuredImagePreviewSrc: z.string().nullable().default(null),
  maxNumberOfAttendees: z
    .number()
    .or(z.string())
    .transform((val): number => {
      if (typeof val === 'number') {
        return val;
      }
      return Number(val);
    })
    .nullable()
    .default(Infinity),
});

const publish = protectedProcedure
  .input(z.object({isPublished: z.boolean(), eventId: z.string()}))
  .mutation(async ({input, ctx}) => {
    await authorizeChange({ctx, eventId: input.eventId});

    const result = await ctx.prisma.event.update({
      where: {id: input.eventId},
      data: {
        isPublished: input.isPublished,
      },
    });

    if (result.isPublished && env.NODE_ENV !== 'development') {
      await ctx.telegram
        .sendMessageToWannaGoChannel({
          message: `${ctx.user.firstName} ${
            ctx.user.lastName
          } published event "${result.title}" ${getBaseUrl()}/e/${
            result.shortId
          }`,
        })
        .catch(console.error);
    }

    return result;
  });

const update = protectedProcedure
  .input(eventInput.extend({eventId: z.string().uuid()}))
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
        featuredImageHeight,
        featuredImageWidth,
        featuredImagePreviewSrc,
        title,
        streamUrl,
      },
      ctx,
    }) => {
      await authorizeChange({ctx, eventId});

      let geocodeResponse = null;

      if (address) {
        geocodeResponse = await ctx.googleMaps.geocode({
          params: {
            key: env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
            address,
          },
        });
      }

      const originalEvent = await ctx.prisma.event.findUnique({
        where: {
          id: eventId,
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
          maxNumberOfAttendees: maxNumberOfAttendees ?? Infinity,
          featuredImageSrc,
          featuredImageHeight,
          featuredImageWidth,
          featuredImagePreviewSrc,
          longitude: geocodeResponse?.data.results[0].geometry.location.lng,
          latitude: geocodeResponse?.data.results[0].geometry.location.lat,
          streamUrl,
        },
      });

      const isTimeChanged = originalEvent?.startDate
        ? differenceInSeconds(
            utcToZonedTime(startDate, ctx.timezone),
            utcToZonedTime(originalEvent.startDate, ctx.timezone)
          ) !== 0
        : false;

      if (isTimeChanged) {
        let messageId: string | null = null;
        try {
          const message = await ctx.mailQueue.updateReminderEmail({
            eventId: event.id,
            messageId: event.messageId,
            timezone: ctx.timezone,
            startDate: event.startDate,
          });
          messageId = message?.messageId || null;
        } catch (error) {}

        if (messageId) {
          event = await ctx.prisma.event.update({
            where: {
              id: eventId,
            },
            data: {
              messageId,
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

    const event = await ctx.prisma.event.findUnique({
      where: {
        id: eventId,
      },
      include: {
        eventSignUps: true,
      },
    });

    await ctx.prisma.eventSignUp.deleteMany({
      where: {
        eventId,
      },
    });

    return ctx.prisma.event.delete({
      where: {
        id: eventId,
      },
    });
  });

const create = protectedProcedure
  .input(eventInput)
  .mutation(
    async ({
      input: {
        title,
        description,
        address,
        endDate,
        featuredImageSrc,
        featuredImageHeight,
        featuredImageWidth,
        featuredImagePreviewSrc,
        maxNumberOfAttendees,
        startDate,
        streamUrl,
      },
      ctx,
    }) => {
      let geocodeResponse = null;

      if (address) {
        geocodeResponse = await ctx.googleMaps.geocode({
          params: {
            key: env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
            address,
          },
        });
      }

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
          maxNumberOfAttendees: maxNumberOfAttendees ?? Infinity,
          featuredImageSrc,
          featuredImageHeight,
          featuredImageWidth,
          featuredImagePreviewSrc,
          streamUrl,
          longitude: geocodeResponse?.data.results[0].geometry.location.lng,
          latitude: geocodeResponse?.data.results[0].geometry.location.lat,
          organization: {
            connect: {
              id: organization.id,
            },
          },
        },
      });

      const message = await ctx.mailQueue.enqueueReminderEmail({
        timezone: ctx.timezone,
        eventId: event.id,
        startDate: event.startDate,
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
      include: {
        organization: {
          include: {
            users: true,
          },
        },
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

const joinEvent = protectedProcedure
  .input(
    z.object({
      eventId: z.string(),
      hasPlusOne: z.boolean(),
    })
  )
  .mutation(async ({input, ctx}) => {
    const user = await ctx.prisma.user.findUnique({
      where: {
        email: ctx.user.emailAddresses[0].emailAddress,
      },
    });

    if (!user) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'User not found',
      });
    }

    const [existingSignUp, event] = await Promise.all([
      ctx.prisma.eventSignUp.findFirst({
        where: {
          eventId: input.eventId,
          userId: user.id,
        },
      }),
      ctx.prisma.event.findFirst({
        where: {
          id: input.eventId,
        },
      }),
    ]);

    if (!event?.isPublished) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Event is not published yet.',
      });
    }

    if (existingSignUp && existingSignUp.status === 'REGISTERED') {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'You are already signed up for this event.',
      });
    }

    const eventSignUpsCount = await ctx.prisma.eventSignUp.count({
      where: {
        eventId: input.eventId,
        status: {
          in: ['REGISTERED'],
        },
      },
    });

    if (
      typeof event?.maxNumberOfAttendees === 'number' &&
      eventSignUpsCount >= event?.maxNumberOfAttendees &&
      event?.maxNumberOfAttendees !== 0
    ) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Event is full and no longer accepts sign ups.',
      });
    }

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

    if (existingSignUp && existingSignUp.status === 'CANCELLED') {
      await ctx.prisma.eventSignUp.update({
        where: {
          id: existingSignUp.id,
        },
        data: {
          hasPlusOne: input.hasPlusOne,
          status: 'REGISTERED',
        },
      });
    }

    await Promise.all([
      ctx.mailQueue.enqueueOrganizerEventSignUpNotificationEmail({
        eventId: input.eventId,
        userId: user.id,
      }),
      ctx.mailQueue.enqueueEventSignUpEmail({
        eventId: input.eventId,
        userId: user.id,
      }),
    ]);

    return {success: true};
  });

const cancelEvent = protectedProcedure
  .input(
    z.object({
      eventId: z.string().uuid(),
    })
  )
  .mutation(async ({input: {eventId}, ctx}) => {
    const user = await ctx.prisma.user.findFirst({
      where: {
        externalId: ctx.user.id,
      },
    });

    if (!user) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'User not found',
      });
    }

    const signUp = await ctx.prisma.eventSignUp.findFirst({
      where: {
        userId: user.id,
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

const cancelEventByUserId = protectedProcedure
  .input(
    z.object({
      eventId: z.string().uuid(),
      userId: z.string().uuid(),
    })
  )
  .mutation(async ({input: {eventId, userId}, ctx}) => {
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
        status: 'REGISTERED',
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
  .input(z.object({eventShortId: z.string()}))
  .query(async ({input, ctx}) => {
    const event = await ctx.prisma.event.findFirst({
      where: {
        shortId: input.eventShortId,
      },
    });

    if (!event) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Event not found',
      });
    }

    await authorizeChange({ctx, eventId: event.id});

    return ctx.prisma.eventSignUp.findMany({
      where: {
        eventId: event.id,
      },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
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
            email: {
              in: ['idarase+clerk_test@gmail.com', 'hi+example@wannago.app'],
            },
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
            email: {
              in: ['idarase+clerk_test@gmail.com', 'hi+example@wannago.app'],
            },
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
      eventShortId: z.string(),
    })
  )
  .query(async ({ctx, input}) => {
    const event = await ctx.prisma.event.findFirst({
      where: {
        shortId: input.eventShortId,
      },
    });

    if (!event) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Event not found',
      });
    }

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
      orderBy: {
        createdAt: 'desc',
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

      if (eventSignUp.eventId === event.id) {
        userMap[eventSignUp.userId].status = eventSignUp.status;
      }
    }

    return Object.values(userMap);
  });

const invitePastAttendee = protectedProcedure
  .input(
    z.object({
      userId: z.string().uuid(),
      eventShortId: z.string(),
    })
  )
  .mutation(async ({ctx, input}) => {
    const event = await ctx.prisma.event.findFirst({
      where: {
        shortId: input.eventShortId,
      },
    });

    if (!event) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Event not found',
      });
    }

    const eventSignUp = await ctx.prisma.eventSignUp.findFirst({
      where: {
        userId: input.userId,
        eventId: event.id,
      },
    });

    if (event.isPublished === false) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: `You can't invite user to unpublished event. Please publish first.`,
      });
    }

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

    const eventSignUpsCount = await ctx.prisma.eventSignUp.count({
      where: {
        eventId: event.id,
        status: {
          in: ['REGISTERED', 'INVITED'],
        },
      },
    });

    if (
      typeof event?.maxNumberOfAttendees === 'number' &&
      eventSignUpsCount >= event?.maxNumberOfAttendees &&
      event?.maxNumberOfAttendees !== 0
    ) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Event is full and no longer accepts sign ups.',
      });
    }

    const invite = await ctx.prisma.eventSignUp.create({
      data: {
        status: 'INVITED',
        eventId: event.id,
        userId: input.userId,
      },
    });

    await ctx.mailQueue.enqueueEventInviteEmail({
      eventId: event.id,
      userId: input.userId,
    });

    return invite;
  });

const inviteByEmail = publicProcedure
  .input(
    z.object({
      eventId: z.string(),
      email: z.string().email('Is not valid email'),
      firstName: z.string(),
      lastName: z.string(),
    })
  )
  .mutation(async ({input, ctx}) => {
    await authorizeChange({ctx, eventId: input.eventId});

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

    if (existingSignUp) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'User is already signed up for this event',
      });
    }

    const event = await ctx.prisma.event.findUnique({
      where: {
        id: input.eventId,
      },
    });

    const eventSignUpsCount = await ctx.prisma.eventSignUp.count({
      where: {
        eventId: input.eventId,
        status: {
          in: ['REGISTERED', 'INVITED'],
        },
      },
    });

    if (
      typeof event?.maxNumberOfAttendees === 'number' &&
      eventSignUpsCount >= event?.maxNumberOfAttendees &&
      event?.maxNumberOfAttendees !== 0
    ) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Event is full and no longer accepts sign ups.',
      });
    }

    await ctx.prisma.eventSignUp.create({
      data: {
        event: {
          connect: {
            id: input.eventId,
          },
        },
        status: 'INVITED',
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    await ctx.mailQueue.enqueueEventInviteEmail({
      eventId: input.eventId,
      userId: user.id,
    });

    return {success: true};
  });

const getMySignUp = protectedProcedure
  .input(
    z.object({
      eventId: z.string().uuid(),
    })
  )
  .query(async ({ctx, input}) => {
    const eventSignUp = await ctx.prisma.eventSignUp.findFirst({
      where: {
        user: {
          externalId: ctx.user?.id,
        },
        eventId: input.eventId,
      },
    });

    return eventSignUp;
  });

export const eventRouter = router({
  create,
  remove,
  update,
  publish,
  getById,
  getByShortId,
  getOrganizer,
  joinEvent,
  cancelEvent,
  cancelEventByUserId,
  getNumberOfAttendees,
  getAttendees,
  getExamples,
  getRandomExample,
  getAllEventsAttendees,
  invitePastAttendee,
  inviteByEmail,
  getMySignUp,
});
