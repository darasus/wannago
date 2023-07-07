'use client';

import {usePathname} from 'next/navigation';
import {use, useEffect} from 'react';
import {toast} from 'react-hot-toast';
import {CardBase, PageHeader, Text} from 'ui';
import {TicketList} from '../TicketList/TicketList';
import {RouterOutputs} from 'api';

interface Props {
  eventSignUpsPromise: Promise<RouterOutputs['event']['getMyTicketsByEvent']>;
}

export function MyTickets({eventSignUpsPromise}: Props) {
  const pathname = usePathname();
  const eventSignUps = use(eventSignUpsPromise);

  useEffect(() => {
    if (
      eventSignUps &&
      eventSignUps?.length > 0 &&
      pathname?.includes('/success')
    ) {
      toast.success('Ticket purchased successfully!');
    }
  }, [eventSignUps, pathname]);

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title={<Text>My tickets</Text>} />
      <CardBase>
        <TicketList eventSignUps={eventSignUps} />
      </CardBase>
    </div>
  );
}
