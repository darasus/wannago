import Link from 'next/link';
import {CardBase, Text} from 'ui';
import {getConversationMembers} from 'utils';
import {api} from '../../../../trpc/server';
import {User} from '@prisma/client';

interface Props {
  me: User;
}

export async function Conversations({me}: Props) {
  const conversations = await api.conversation.getMyConversations.query();

  return (
    <CardBase innerClassName="flex flex-col gap-4">
      {conversations?.length === 0 && (
        <Text className="text-center">No conversations yet...</Text>
      )}
      {conversations?.map(c => {
        const conversationMember = getConversationMembers(c, me);

        return (
          <Link
            key={c.id}
            className="flex flex-col hover:bg-gray-100 rounded-xl -m-2 py-2 px-3"
            href={`/messages/${c.id}`}
          >
            <Text className="font-bold">
              {conversationMember.map(({label}) => label).join(', ')}
            </Text>
            <div className="flex items-center gap-2">
              {c.hasUnseenMessages && (
                <div className="w-3 h-3 rounded-full bg-red-500" />
              )}
              <Text>
                {c.messages?.[0]?.text
                  ? c.messages?.[0]?.text
                  : 'No messages...'}
              </Text>
            </div>
          </Link>
        );
      })}
    </CardBase>
  );
}