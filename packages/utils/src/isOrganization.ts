import {Organization, User} from '@prisma/client';

export function isOrganization(
  organizer: User | Organization
): organizer is Organization {
  return (organizer as Organization).logoSrc !== undefined;
}
