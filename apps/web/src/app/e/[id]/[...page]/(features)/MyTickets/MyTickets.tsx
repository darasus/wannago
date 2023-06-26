'use client';

import {useParams, usePathname} from 'next/navigation';
import {use, useEffect} from 'react';
import {toast} from 'react-hot-toast';
import {CardBase, PageHeader, Text, TicketList} from 'ui';
import {api} from '../../../../../../trpc/client';

export function MyTickets() {
  const params = useParams();
  const pathname = usePathname();
  const id = params?.id as string;
  const tickets = use(
    api.event.getMyTicketsByEvent.query({
      eventShortId: id,
    })
  );

  useEffect(() => {
    if (tickets && tickets?.length > 0 && pathname?.includes('/success')) {
      toast.success('Ticket purchased successfully!');
    }
  }, [tickets, pathname]);

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title={<Text>My tickets</Text>} />
      <CardBase>
        <TicketList tickets={tickets ?? []} />
      </CardBase>
    </div>
  );
}
