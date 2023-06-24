import {Conversation, Organization, User} from '@prisma/client';

interface Member {
  label: string;
  href: string;
}

export function getConversationMembers(
  conversation:
    | (Conversation & {users: User[]; organizations: Organization[]})
    | null
    | undefined,
  me: User | Organization | null | undefined
): Member[] {
  const list: (User | Organization)[] = [
    ...(conversation?.organizations || []),
    ...(conversation?.users || []),
  ].filter(Boolean);

  const arr: Member[] = [];

  for (const member of list) {
    if ('firstName' in member) {
      arr.push({
        label: `${member.firstName} ${member.lastName}`,
        href: `/u/${member.id}`,
      });
    }
    if ('name' in member && member.name) {
      arr.push({
        label: member.name,
        href: `/o/${member.id}`,
      });
    }
  }

  return arr;
}
