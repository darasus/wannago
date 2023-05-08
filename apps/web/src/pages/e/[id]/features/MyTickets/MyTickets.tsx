import {useRouter} from 'next/router';
import {useEffect} from 'react';
import {toast} from 'react-hot-toast';
import {trpc} from 'trpc/src/trpc';
import {CardBase, LoadingBlock, PageHeader, Text} from 'ui';

export function MyTickets() {
  const router = useRouter();
  const tickets = trpc.event.getMyTicketsByEvent.useQuery({
    eventShortId: router.query.id as string,
  });

  useEffect(() => {
    if (
      tickets.data &&
      tickets.data?.length > 0 &&
      router.query.success === 'true'
    ) {
      toast.success('Ticket purchased successfully!');
    }
  }, [router.query.success, tickets.data]);

  if (tickets.isInitialLoading) {
    return <LoadingBlock />;
  }

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title={<Text>My tickets</Text>} />
      <CardBase>
        <div className="divide-y-2">
          {tickets.data?.map(ticket => {
            return (
              <div key={ticket.id} className="flex">
                <div className="grow">
                  <Text>{`${ticket.title}`}</Text>
                </div>
                <Text>{`quantity: ${ticket.quantity}`}</Text>
              </div>
            );
          })}
        </div>
      </CardBase>
    </div>
  );
}
