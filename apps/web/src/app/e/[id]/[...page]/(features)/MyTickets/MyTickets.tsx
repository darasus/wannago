'use client';

import {useSearchParams} from 'next/navigation';
import {use, useEffect} from 'react';
import {CardBase, PageHeader, Text} from 'ui';
import {TicketList} from '../TicketList/TicketList';
import {RouterOutputs} from 'api';
import {toast} from 'react-hot-toast';

interface Props {
  eventSignUpsPromise: Promise<RouterOutputs['event']['getMyTicketsByEvent']>;
}

export function MyTickets({eventSignUpsPromise}: Props) {
  const params = useSearchParams();
  const eventSignUps = use(eventSignUpsPromise);

  useEffect(() => {
    if (
      eventSignUps &&
      eventSignUps?.length > 0 &&
      params?.get('success') === 'true'
    ) {
      toast.success('Ticket purchased successfully!');
    }
  }, [eventSignUps, params]);

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title={<Text>My tickets</Text>} />
      <CardBase>
        <TicketList eventSignUps={eventSignUps} />
      </CardBase>
    </div>
  );
}
