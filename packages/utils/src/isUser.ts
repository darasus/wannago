import {Organization, User} from '@prisma/client';

export function isUser(
  organizer:
    | Omit<User, 'createdAt' | 'updatedAt'>
    | Omit<Organization, 'createdAt' | 'updatedAt'>
    | null
    | undefined
): organizer is User {
  return (organizer as User).profileImageSrc !== undefined;
}
