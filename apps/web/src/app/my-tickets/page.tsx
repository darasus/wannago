import {Container, PageHeader} from 'ui';
import {api} from '../../trpc/server-http';
import {MyTickets} from './(features)/MyTickets/MyTickets';

export default async function TicketsPage() {
  const myTicketSalesPromise = api.user.getMyTickets.query();

  return (
    <Container maxSize="sm">
      <div className="flex flex-col gap-4">
        <PageHeader title={'My tickets'} />
        <MyTickets myTicketSalesPromise={myTicketSalesPromise} />
      </div>
    </Container>
  );
}
