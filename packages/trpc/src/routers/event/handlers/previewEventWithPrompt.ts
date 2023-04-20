import {Event, User} from '@prisma/client';
import {TRPCError} from '@trpc/server';
import {env} from 'client-env';
import {randomUUID} from 'crypto';
import {parseISO} from 'date-fns';
import {userNotFoundError} from 'error';
import {nanoid} from 'nanoid';
import {getBaseUrl, invariant} from 'utils';
import {z} from 'zod';
import {protectedProcedure} from '../../../trpcServer';

export const previewEventWithPrompt = protectedProcedure
  .input(
    z.object({
      prompt: z.string(),
    })
  )
  .mutation(async ({input, ctx}) => {
    const url = new URL(`${getBaseUrl()}/api/ai`);

    url.searchParams.append('prompt', input.prompt);
    url.searchParams.append('timezone', ctx.timezone);

    const response = await fetch(url).catch(err => {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: `Something went wrong. Please try again.`,
      });
    });
    const data = await response.json();
    const user = await ctx.actions.getUserByExternalId({
      externalId: ctx.auth?.userId,
    });

    invariant(user, userNotFoundError);

    const responseSchema = z.object({
      output: z.object({
        title: z.string().transform(value => {
          return value
            .replaceAll('{name}', user.firstName)
            .replaceAll('{Name}', user.firstName);
        }),
        description: z.string().transform(value => {
          return value
            .replaceAll('{name}', user.firstName)
            .replaceAll('{Name}', user.firstName);
        }),
        address: z.string({
          required_error: `Doesn't seem like you entered an address. Please try again.`,
        }),
        startDate: z.string().transform(value => {
          if (value === 'unknown') {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: `Doesn't seem like you entered time of your event. Please try again.`,
            });
          }

          return parseISO(value);
        }),
        endDate: z.string().transform(value => {
          if (value === 'unknown') {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: `Doesn't seem like you entered time of your event. Please try again.`,
            });
          }

          return parseISO(value);
        }),
        maxNumberOfAttendees: z.string().transform(value => {
          if (value === 'unknown') {
            return 0;
          }

          return Number(value);
        }),
        imagePrompt: z.string(),
      }),
    });

    const {output} = responseSchema.parse(data);

    if (output.address === 'unknown') {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: `Doesn't seem like you entered location for your event. Please try again.`,
      });
    }

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

    const imageResponse = await fetch(
      `${getBaseUrl()}/api/ai-image?prompt=${encodeURI(output.imagePrompt)}`
    ).then(res => res.json());

    const event: Event & {user: User; organization: null} = {
      id: randomUUID(),
      title: output.title,
      maxNumberOfAttendees: output.maxNumberOfAttendees,
      description: output.description,
      address: addressResult.formatted_address || output.address,
      startDate: output.startDate,
      endDate: output.endDate,
      shortId: nanoid(6),
      longitude: addressResult.geometry.location.lng,
      latitude: addressResult.geometry.location.lat,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: user.id,
      user,
      organizationId: null,
      organization: null,
      isPublished: true,
      featuredImageHeight: imageResponse.height,
      featuredImageWidth: imageResponse.width,
      featuredImageSrc: imageResponse.url,
      featuredImagePreviewSrc: imageResponse.imageSrcBase64,
      streamUrl: null,
      messageId: null,
    };

    return event;
  });
