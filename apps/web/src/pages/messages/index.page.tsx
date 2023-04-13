import {Container, PageHeader} from 'ui';
import {Conversations} from './features/Conversations/Conversations';

export default function MessagesPage() {
  return (
    <Container className="flex flex-col gap-4" maxSize="sm">
      <PageHeader title="Messages" />
      <Conversations />
    </Container>
  );
}
