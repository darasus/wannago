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
        },
      });

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
