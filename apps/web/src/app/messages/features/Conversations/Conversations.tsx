import Link from 'next/link';
import {CardBase, Text} from 'ui';
import {getConversationMembers} from 'utils';
import {RouterOutputs} from 'api';
import {notFound} from 'next/navigation';

interface Props {
  mePromise: Promise<RouterOutputs['user']['me']>;
  conversationsPromise: Promise<
    RouterOutputs['conversation']['getMyConversations']
  >;
}

export async function Conversations({mePromise, conversationsPromise}: Props) {
  const me = await mePromise;
  const conversations = await conversationsPromise;

  if (!me) {
    return notFound();
  }

  return (
    <CardBase innerClassName="flex flex-col gap-4">
      {conversations?.length === 0 && (
        <Text className="text-center">No conversations yet...</Text>
      )}
      {conversations?.map((c) => {
        const conversationMember = getConversationMembers(c, me);

        return (
          <Link
            key={c.id}
            className="flex flex-col hover:bg-muted rounded-md -m-2 py-2 px-3"
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
