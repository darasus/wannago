import {api} from '../../../trpc/server-http';
import {PageContainer} from '../PageContainer';
import {MyTickets} from './features/MyTickets/MyTickets';

export default async function TicketsPage() {
  const myTicketSalesPromise = api.user.getMyTickets.query();

  return (
    <PageContainer title="My tickets">
      <MyTickets myTicketSalesPromise={myTicketSalesPromise} />
    </PageContainer>
  );
}
