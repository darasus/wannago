// import {Event, Organization, Ticket, User} from '@prisma/client';
// import {env} from 'client-env';
// import {randomUUID} from 'crypto';
// import {userNotFoundError} from 'error';
// import {generateShortId, invariant} from 'utils';
// import {z} from 'zod';
// import {protectedProcedure} from '../../../trpc';

// export const generateEventWithPrompt = protectedProcedure
//   .input(
//     z.object({
//       prompt: z.string(),
//     })
//   )
//   .mutation(async ({input, ctx}) => {
//     const user = await ctx.actions.getUserByExternalId({
//       id: ctx.auth?.user?.id,
//       includeOrganization: true,
//     });

//     invariant(user, userNotFoundError);

//     const output = await ctx.actions.generateEventFromPrompt({
//       prompt: input.prompt,
//       firstName: user.firstName,
//     });

//     const result = await ctx.googleMaps.placeAutocomplete({
//       params: {
//         key: env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
//         input: output.address,
//       },
//     });

//     const geocodeResponse = await ctx.googleMaps.geocode({
//       params: {
//         key: env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
//         place_id: result.data.predictions[0].place_id,
//       },
//     });

//     const addressResult = geocodeResponse?.data.results?.[0];

//     const event: Event & {
//       user: User | null;
//       organization: Organization | null;
//       imagePrompt: string;
//       tickets: Ticket[];
//     } = {
//       id: randomUUID(),
//       title: output.title,
//       maxNumberOfAttendees: output.maxNumberOfAttendees,
//       description: output.description,
//       address: addressResult.formatted_address || output.address,
//       startDate: output.startDate,
//       endDate: output.endDate,
//       shortId: generateShortId(),
//       longitude: addressResult.geometry.location.lng,
//       latitude: addressResult.geometry.location.lat,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//       isPublished: true,
//       featuredImageHeight: null,
//       featuredImageWidth: null,
//       featuredImageSrc: null,
//       featuredImagePreviewSrc: null,
//       messageId: null,
//       imagePrompt: output.imagePrompt,
//       tickets: [],
//       preferredCurrency: user.preferredCurrency,
//       userId: user.id,
//       user,
//       organizationId: null,
//       organization: null,
//     };

//     return event;
//   });
export {};
