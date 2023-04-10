import {useMyOrganizationQuery, useMyUserQuery, useSessionQuery} from 'hooks';
import Link from 'next/link';
import {trpc} from 'trpc/src/trpc';
import {CardBase, LoadingBlock, Text} from 'ui';
import {getConversationMembers} from 'utils';

export function Conversations() {
  const me = useMyUserQuery();
  const organization = useMyOrganizationQuery();
  const session = useSessionQuery();
  const conversations = trpc.conversation.getMyConversations.useQuery();

  if (conversations.isLoading) {
    return <LoadingBlock />;
  }

  return (
    <CardBase innerClassName="flex flex-col gap-4">
      {conversations.data?.length === 0 && (
        <Text className="text-center">No conversations yet...</Text>
      )}
      {conversations.data?.map(c => {
        const conversationMember = getConversationMembers(
          c,
          session.data === 'user' ? me.data : organization.data
        );

        return (
          <Link
            key={c.id}
            className="flex flex-col hover:bg-gray-100 rounded-xl -m-2 p-2"
            href={`/messages/${c.id}`}
          >
            <Text className="font-bold">
              {conversationMember.map(({label}) => label)}
            </Text>
            <Text>{c.messages?.[0]?.text}</Text>
          </Link>
        );
      })}
    </CardBase>
  );
}
