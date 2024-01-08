import {generateShortId, geocode, invariant} from 'utils';
import {protectedProcedure} from '../../../trpc';
import {eventInput} from '../validation';
import {TRPCError} from '@trpc/server';
import {Currency} from '@prisma/client';

export const create = protectedProcedure
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
        createdById,
        tickets,
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
        ctx.prisma.user.findUnique({
          where: {id: createdById},
        }),
      ]);

      const preferredCurrency = Currency.USD;

      invariant(
        preferredCurrency,
        new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Preferred currency is required',
        })
      );

      const event = await ctx.prisma.event.create({
        data: {
          shortId: generateShortId(),
          title,
          description,
          endDate,
          startDate,
          address: address,
          maxNumberOfAttendees: maxNumberOfAttendees ?? 0,
          featuredImageSrc,
          featuredImageHeight,
          featuredImageWidth,
          featuredImagePreviewSrc,
          longitude: geocodeResponse?.results[0].geometry.location.lng,
          latitude: geocodeResponse?.results[0].geometry.location.lat,
          preferredCurrency,
          listing,
          eventVisibility,
          eventVisibilityCode,
          signUpProtection,
          signUpProtectionCode,
        },
      });

      if (tickets.length > 0) {
        await ctx.prisma.ticket.createMany({
          data: tickets.map((ticket) => ({
            title: ticket.title,
            price: ticket.price,
            maxQuantity: ticket.maxQuantity,
            description: ticket.description,
            eventId: event.id,
          })),
        });
      }

      await ctx.inngest.send({
        name: 'event.created',
        data: {eventId: event.id},
      });

      return event;
    }
  );
