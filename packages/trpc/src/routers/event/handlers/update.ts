import {env} from 'server-env';
import {z} from 'zod';
import {protectedProcedure} from '../../../trpcServer';
import {eventInput} from '../validation';

export const update = protectedProcedure
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
        tickets,
      },
      ctx,
    }) => {
      await ctx.actions.canModifyEvent({eventId});

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
          title,
          description,
          startDate,
          endDate,
          address,
          maxNumberOfAttendees: maxNumberOfAttendees ?? 0,
          featuredImageSrc,
          featuredImageHeight,
          featuredImageWidth,
          featuredImagePreviewSrc,
          longitude: geocodeResponse?.data.results[0].geometry.location.lng,
          latitude: geocodeResponse?.data.results[0].geometry.location.lat,
        },
      });

      for (const ticket of tickets) {
        if (ticket.id) {
          await ctx.prisma.ticket.update({
            where: {
              id: ticket.id,
            },
            data: {
              title: ticket.title,
              price: ticket.price,
              maxQuantity: ticket.maxQuantity,
              description: ticket.description,
            },
          });
        } else {
          await ctx.prisma.ticket.create({
            data: {
              title: ticket.title,
              price: ticket.price,
              maxQuantity: ticket.maxQuantity,
              description: ticket.description,
              eventId: event.id,
            },
          });
        }
      }

      const {messageId} = await ctx.actions.updateEventReminder({
        eventId,
        startDate: event.startDate,
        oldMessageId: originalEvent?.messageId,
      });

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

      return event;
    }
  );
