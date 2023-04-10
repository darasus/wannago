import Link from 'next/link';
import {trpc} from 'trpc/src/trpc';
import {CardBase, Text} from 'ui';

export function Conversations() {
  const conversations = trpc.conversation.getMyConversations.useQuery();

  return (
    <CardBase innerClassName="flex flex-col gap-4">
      {conversations.data?.map(c => {
        const participants = [
          ...c.users.map(u => u.firstName),
          ...c.organizations.map(o => o.name),
        ]
          .sort()
          .join(' & ');

        return (
          <Link
            key={c.id}
            className="flex flex-col hover:bg-gray-100 rounded-xl -m-2 p-2"
            href={`/messages/${c.id}`}
          >
            <Text className="font-bold">{participants}</Text>
            <Text>{c.messages?.[0]?.text}</Text>
          </Link>
        );
      })}
    </CardBase>
  );
}
