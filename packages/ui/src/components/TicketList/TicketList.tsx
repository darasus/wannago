import {Text} from '../Text/Text';

interface Props {
  tickets: Array<{id: string; title: string; quantity: number}>;
}

export function TicketList({tickets}: Props) {
  return (
    <div className="divide-y-2">
      {tickets.map(ticket => {
        return (
          <div key={ticket.id} className="flex">
            <div className="grow">
              <Text className="font-bold">{`${ticket.title}`}</Text>
            </div>
            <Text>{`quantity: ${ticket.quantity}`}</Text>
          </div>
        );
      })}
    </div>
  );
}
