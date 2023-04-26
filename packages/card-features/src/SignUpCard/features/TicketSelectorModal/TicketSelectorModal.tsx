import {Button, Modal, Text} from 'ui';
import {Event, Ticket} from '@prisma/client';
import {Input} from '../../../../../../apps/web/src/components/Input/Input/Input';
import {formatCents} from 'utils';
import {useForm} from 'react-hook-form';

interface Props {
  event: Event & {tickets: Ticket[]};
  isOpen: boolean;
  onClose: () => void;
  onDone?: () => void;
}

interface Form {
  [key: string]: string;
}

export function TicketSelectorModal({isOpen, onClose, onDone, event}: Props) {
  const form = useForm<Form>({defaultValues: {}});
  const total = Object.entries(form.watch()).reduce(
    (acc: number, [ticketId, quantity]) => {
      if (isNaN(Number(quantity))) {
        return acc;
      }

      const ticket = event.tickets.find(ticket => ticket.id === ticketId);

      if (!ticket) {
        return acc;
      }

      return Number(quantity) * ticket?.price + acc;
    },
    0
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-4">
        {event.tickets.map(({title, price, id}) => {
          return (
            <>
              <div key={id} className="flex items-center gap-4">
                <div className="flex grow">
                  <div className="grow">
                    <Text>{title}</Text>
                  </div>
                  <div>
                    <Text>{formatCents(price)}</Text>
                  </div>
                </div>
                <Input
                  placeholder="Quantity"
                  type="number"
                  inputClassName="w-[120px]"
                  {...form.register(id)}
                />
              </div>
              <div className="h-[2px] bg-gray-800" />
            </>
          );
        })}
        <div className="flex">
          <div className="grow">
            <Text>Total:</Text>
          </div>
          <div>
            <Text className="font-bold">{formatCents(total)}</Text>
          </div>
        </div>
        <Button>Buy</Button>
      </div>
    </Modal>
  );
}
