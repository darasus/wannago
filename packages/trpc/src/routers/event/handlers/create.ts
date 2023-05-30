import {env} from 'server-env';
import {generateShortId} from 'utils';
import {z} from 'zod';
import {protectedProcedure} from '../../../trpcServer';
import {eventInput} from '../validation';

export const create = protectedProcedure
  .input(eventInput.extend({authorId: z.string().uuid()}))
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
        authorId,
        tickets,
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

      const [user, organization, subscription, userEventCount] =
        await Promise.all([
          ctx.prisma.user.findFirst({
            where: {id: authorId},
          }),
          ctx.actions.getOrganizationById({id: authorId}),
          ctx.prisma.subscription.findFirst({
            where: {
              OR: [
                {
                  user: {
                    some: {
                      id: authorId,
                    },
                  },
                },
                {
                  organization: {
                    some: {
                      id: authorId,
                    },
                  },
                },
              ],
            },
          }),
          ctx.prisma.event.count({
            where: {
              userId: authorId,
            },
          }),
        ]);

      ctx.assertions.assertCanCreateEvent({
        user,
        organization,
        subscription,
        userEventCount,
      });

      let event = await ctx.prisma.event.create({
        data: {
          shortId: generateShortId(),
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
          longitude: geocodeResponse?.data.results[0].geometry.location.lng,
          latitude: geocodeResponse?.data.results[0].geometry.location.lat,
          ...(organization?.id
            ? {organization: {connect: {id: organization.id}}}
            : {}),
          ...(user?.id ? {user: {connect: {id: user.id}}} : {}),
        },
      });

      if (tickets.length > 0) {
        await ctx.prisma.ticket.createMany({
          data: tickets.map(ticket => ({
            title: ticket.title,
            price: ticket.price,
            maxQuantity: ticket.maxQuantity,
            description: ticket.description,
            eventId: event.id,
          })),
        });
      }

      const {messageId} = await ctx.actions.createEventReminder({
        eventId: event.id,
        startDate: event.startDate,
      });

      if (messageId) {
        event = await ctx.prisma.event.update({
          where: {
            id: event.id,
          },
          data: {
            messageId,
          },
        });
      }

      return event;
    }
  );
