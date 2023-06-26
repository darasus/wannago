import {Container, PageHeader} from 'ui';
import {Conversations} from './(features)/Conversations/Conversations';
import {getMe} from '../../trpc/server';

export default async function MessagesPage() {
  const me = await getMe();

  if (!me) {
    return null;
  }

  return (
    <Container className="flex flex-col gap-4" maxSize="sm">
      <PageHeader title="Messages" />
      <Conversations me={me} />
    </Container>
  );
}
