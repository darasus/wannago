import {Text} from '../Text/Text';

interface Ticket {
  id: string;
  title: string;
  description?: string | null;
  quantity: number;
}

interface Props {
  tickets: Array<Ticket>;
}

export function TicketList({tickets}: Props) {
  return (
    <div className="flex flex-col gap-2">
      {tickets.map(ticket => {
        return (
          <div key={ticket.id} className="flex flex-col gap-2">
            <div className="flex">
              <div className="grow">
                <div>
                  <Text className="font-bold">{`${ticket.title}`}</Text>
                </div>
              </div>
              <Text>{`quantity: ${ticket.quantity}`}</Text>
            </div>
            {ticket.description && (
              <div className="bg-gray-100 p-2 rounded-xl">
                <Text className="">{`${ticket.description}`}</Text>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
