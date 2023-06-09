import {Organization, User} from '@prisma/client';

export function isOrganization(
  organizer:
    | Omit<User, 'createdAt' | 'updatedAt'>
    | Omit<Organization, 'createdAt' | 'updatedAt'>
    | null
    | undefined
): organizer is Organization {
  return (organizer as Organization).logoSrc !== undefined;
}
