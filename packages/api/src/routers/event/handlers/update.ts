import {z} from 'zod';
import {protectedProcedure} from '../../../trpc';
import {eventInput} from '../validation';
import {geocode} from 'utils';
import {TRPCError} from '@trpc/server';

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
        eventVisibility,
        eventVisibilityCode,
        signUpProtection,
        signUpProtectionCode,
        listing,
      },
      ctx,
    }) => {
      const geocodeResponse = await geocode(address);

      const [user] = await Promise.all([
        await ctx.prisma.user.findUnique({
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
          longitude: geocodeResponse?.results[0].geometry.location.lng,
          latitude: geocodeResponse?.results[0].geometry.location.lat,
          eventVisibility,
          eventVisibilityCode,
          signUpProtection,
          signUpProtectionCode,
          listing,
        },
        include: {tickets: true},
      });

      for (const ticket of event.tickets) {
        const ticketInInput = tickets.find((t) => t.id === ticket.id);

        if (!ticketInInput) {
          try {
            await ctx.prisma.ticket.delete({
              where: {
                id: ticket.id,
              },
            });
          } catch {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: `You can't remove ticket that has at least 1 sale`,
            });
          }
        }
      }

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
