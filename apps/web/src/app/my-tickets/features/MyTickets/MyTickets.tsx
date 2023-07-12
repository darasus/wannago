import {RouterOutputs} from 'api';
import {FileDown} from 'lucide-react';
import Link from 'next/link';
import {Button, CardBase, Text} from 'ui';

interface Props {
  myTicketSalesPromise: Promise<RouterOutputs['user']['getMyTickets']>;
}

export async function MyTickets({myTicketSalesPromise}: Props) {
  const myTicketSales = await myTicketSalesPromise;

  return (
    <>
      {(!myTicketSales || myTicketSales.length === 0) && (
        <CardBase>
          <div className="text-center">{`You don't have any tickets yet...`}</div>
        </CardBase>
      )}
      {myTicketSales.map((ticketSale) => {
        return (
          <CardBase
            key={ticketSale.id}
            title={<Text truncate>{ticketSale.event.title}</Text>}
            titleChildren={
              <Button variant={'link'} className="p-0" asChild>
                <Link href={`/e/${ticketSale.event.shortId}`}>View event</Link>
              </Button>
            }
          >
            <div className="flex items-center gap-2">
              <Text>{ticketSale.ticket.title}</Text>
              <div className="grow" />
              <Text>{`Quantity: ${ticketSale.quantity}`}</Text>
              <Button variant={'outline'} size="sm">
                <Link
                  href={`/api/pdf-ticket/${ticketSale.id}`}
                  target="_blank"
                  className="flex items-center gap-1"
                >
                  <FileDown className="w-4 h-4 mr-1" />
                  Download
                </Link>
              </Button>
            </div>
          </CardBase>
        );
      })}
    </>
  );
}
