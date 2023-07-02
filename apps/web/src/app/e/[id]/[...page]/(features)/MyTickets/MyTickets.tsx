'use client';

import {usePathname} from 'next/navigation';
import {use, useEffect} from 'react';
import {toast} from 'react-hot-toast';
import {CardBase, PageHeader, Text, TicketList} from 'ui';
import {api} from '../../../../../../trpc/client';

interface Props {
  myTicketPromise: ReturnType<typeof api.event.getMyTicketsByEvent.query>;
}

export function MyTickets({myTicketPromise}: Props) {
  const pathname = usePathname();
  const tickets = use(myTicketPromise);

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
