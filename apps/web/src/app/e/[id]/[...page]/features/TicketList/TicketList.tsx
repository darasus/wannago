import {FileDown} from 'lucide-react';
import {Button} from 'ui/src/Button/Button';
import {Text} from 'ui/src/Text/Text';
import Link from 'next/link';
import {RouterOutputs} from 'api';

interface Props {
  eventSignUps: RouterOutputs['event']['getMyTicketsByEvent'];
}

export function TicketList({eventSignUps}: Props) {
  return (
    <div className="flex flex-col gap-2">
      {eventSignUps?.map(({ticketSales}) => {
        return ticketSales.map((ticketSale) => (
          <div key={ticketSale.id} className="flex flex-col gap-2">
            <div className="flex">
              <div className="grow">
                <div>
                  <Text className="font-bold">{`${ticketSale.ticket.title}`}</Text>
                </div>
              </div>
              <Text>{`quantity: ${ticketSale.quantity}`}</Text>
            </div>
            {ticketSale.ticket.description && (
              <div className="bg-muted p-2 rounded-xl">
                <Text className="">{`${ticketSale.ticket.description}`}</Text>
              </div>
            )}
            <Button size="sm" variant="outline" asChild>
              <Link href={`/api/pdf-ticket/${ticketSale.id}`} target="_blank">
                <FileDown className="w-4 h-4 mr-1" />
                Download
              </Link>
            </Button>
          </div>
        ));
      })}
    </div>
  );
}
