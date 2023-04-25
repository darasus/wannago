import {Event, Organization, User} from '@prisma/client';
import {env} from 'client-env';
import {randomUUID} from 'crypto';
import {organizationNotFoundError, userNotFoundError} from 'error';
import {generateShortId, invariant} from 'utils';
import {z} from 'zod';
import {protectedProcedure} from '../../../trpcServer';

export const generateEventWithPrompt = protectedProcedure
  .input(
    z.object({
      prompt: z.string(),
    })
  )
  .mutation(async ({input, ctx}) => {
    const session = await ctx.actions.getActiveSessionType();
    const user = await ctx.actions.getUserByExternalId({
      externalId: ctx.auth?.userId,
      includeOrganization: true,
    });
    const isOrganizationSession = session === 'organization';

    invariant(user, userNotFoundError);

    if (isOrganizationSession) {
      invariant(user.organization, organizationNotFoundError);
    }

    const output = await ctx.actions.generateEventFromPrompt({
      prompt: input.prompt,
      firstName: isOrganizationSession
        ? user.organization?.name!
        : user.firstName,
    });

    const result = await ctx.googleMaps.placeAutocomplete({
      params: {
        key: env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
        input: output.address,
      },
    });

    const geocodeResponse = await ctx.googleMaps.geocode({
      params: {
        key: env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
        place_id: result.data.predictions[0].place_id,
      },
    });

    const addressResult = geocodeResponse?.data.results?.[0];

    const event: Event & {
      user: User | null;
      organization: Organization | null;
      imagePrompt: string;
    } = {
      id: randomUUID(),
      title: output.title,
      maxNumberOfAttendees: output.maxNumberOfAttendees,
      description: output.description,
      address: addressResult.formatted_address || output.address,
      startDate: output.startDate,
      endDate: output.endDate,
      shortId: generateShortId(),
      longitude: addressResult.geometry.location.lng,
      latitude: addressResult.geometry.location.lat,
      createdAt: new Date(),
      updatedAt: new Date(),
      isPublished: true,
      featuredImageHeight: null,
      featuredImageWidth: null,
      featuredImageSrc: null,
      featuredImagePreviewSrc: null,
      messageId: null,
      imagePrompt: output.imagePrompt,
      ...(isOrganizationSession
        ? {
            organizationId: user.organization?.id!,
            organization: user.organization,
            userId: null,
            user: null,
          }
        : {userId: user.id, user, organizationId: null, organization: null}),
    };

    return event;
  });