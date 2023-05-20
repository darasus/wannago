import {Button, Modal, Text} from 'ui';
import {Event, Ticket} from '@prisma/client';
import {Input} from '../../../../../../apps/web/src/components/Input/Input/Input';
import {formatCents} from 'utils';
import {useForm} from 'react-hook-form';
import {trpc} from 'trpc/src/trpc';
import {useRouter} from 'next/router';

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
  const router = useRouter();
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
  const createPaymentSession =
    trpc.payments.createCheckoutSession.useMutation();

  const handleSubmit = form.handleSubmit(async data => {
    const responseUrl = await createPaymentSession.mutateAsync({
      tickets: Object.entries(data)
        .filter(([, quantity]) => Boolean(quantity))
        .map(([ticketId, quantity]) => ({
          ticketId,
          quantity: Number(quantity) || 0,
        })),
      eventId: event.id,
    });

    if (!responseUrl) {
      return;
    }

    router.push(responseUrl);
  });

  return (
    <form onSubmit={handleSubmit}>
      <Modal isOpen={isOpen} onClose={onClose}>
        <div className="flex flex-col gap-4">
          {event.tickets.map(({title, price, id, description}) => {
            return (
              <div key={id} className="divide-2">
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
                <Text>{description}</Text>
              </div>
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
          <Button type="submit" isLoading={createPaymentSession.isLoading}>
            Buy
          </Button>
        </div>
      </Modal>
    </form>
  );
}
