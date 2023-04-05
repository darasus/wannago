import {Organization, User} from '@prisma/client';

export function isUser(
  organizer: User | Organization | null | undefined
): organizer is User {
  return (organizer as User).profileImageSrc !== undefined;
}
