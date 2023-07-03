import {generateShortId, geocode, invariant} from 'utils';
import {protectedProcedure} from '../../../trpc';
import {eventInput} from '../validation';
import {TRPCError} from '@trpc/server';

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
      },
      ctx,
    }) => {
      const geocodeResponse = await geocode(address);

      const [user, organization] = await Promise.all([
        ctx.prisma.user.findUnique({
          where: {id: createdById},
        }),
        ctx.prisma.organization.findUnique({where: {id: createdById}}),
      ]);

      const preferredCurrency = user?.id
        ? user.preferredCurrency
        : organization?.preferredCurrency;

      invariant(
        preferredCurrency,
        new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Preferred currency is required',
        })
      );

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
          longitude: geocodeResponse?.results[0].geometry.location.lng,
          latitude: geocodeResponse?.results[0].geometry.location.lat,
          preferredCurrency,
          ...(organization?.id
            ? {
                organization: {connect: {id: organization.id}},
              }
            : {}),
          ...(user?.id
            ? {
                user: {connect: {id: user.id}},
              }
            : {}),
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
