import {Container, PageHeader} from 'ui';
import {Conversations} from './(features)/Conversations/Conversations';
import {api} from '../../trpc/server';

export default async function MessagesPage() {
  const me = await api.user.me.query();

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
