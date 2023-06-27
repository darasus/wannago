import {z} from 'zod';
import {protectedProcedure} from '../../../trpc';
import {eventInput} from '../validation';
import {geocode} from 'utils';

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
        createdById,
      },
      ctx,
    }) => {
      await ctx.actions.canModifyEvent({eventId});

      let geocodeResponse = null;

      if (address) {
        geocodeResponse = await geocode(address);
      }

      const [user, organization] = await Promise.all([
        await ctx.prisma.user.findUnique({
          where: {id: createdById},
        }),
        await ctx.prisma.organization.findUnique({
          where: {id: createdById},
        }),
      ]);

      const event = await ctx.prisma.event.update({
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
          ...(user && {
            user: {
              connect: {
                id: user.id,
              },
            },
            organization: {
              disconnect: true,
            },
          }),
          ...(organization && {
            organization: {
              connect: {
                id: organization.id,
              },
            },
            user: {
              disconnect: true,
            },
          }),
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

      await ctx.inngest.send({
        name: 'event.updated',
        data: {eventId: event.id},
      });

      return event;
    }
  );
