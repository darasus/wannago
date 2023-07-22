import {Container, LoadingBlock, PageHeader} from 'ui';
import {Conversations} from './features/Conversations/Conversations';
import {Suspense} from 'react';
import {api} from '../../trpc/server-http';

export const runtime = 'nodejs';
export const preferredRegion = 'iad1';

export default async function MessagesPage() {
  return (
    <Container className="flex flex-col gap-4" maxSize="sm">
      <PageHeader title="Messages" />
      <Suspense fallback={<LoadingBlock />}>
        <Conversations
          mePromise={api.user.me.query()}
          conversationsPromise={api.conversation.getMyConversations.query()}
        />
      </Suspense>
    </Container>
  );
}
