import {organizerNotFoundError} from 'error';
import {invariant, isOrganization, isUser} from 'utils';
import {z} from 'zod';
import {publicProcedure} from '../../../trpc';

export const getOrganizer = publicProcedure
  .input(z.object({eventShortId: z.string()}))
  .query(async ({input, ctx}) => {
    const organizer = await ctx.actions.getOrganizerByEventId({
      id: input.eventShortId,
    });

    invariant(organizer, organizerNotFoundError);

    if (isUser(organizer)) {
      return {
        id: organizer.id,
        name: `${organizer.firstName} ${organizer.lastName}`,
        profileImageSrc: organizer.profileImageSrc,
        profilePath: `/u/${organizer.id}`,
      };
    }

    if (isOrganization(organizer)) {
      return {
        id: organizer.id,
        name: organizer.name,
        profileImageSrc: organizer.logoSrc,
        profilePath: `/o/${organizer.id}`,
      };
    }

    return null;
  });
