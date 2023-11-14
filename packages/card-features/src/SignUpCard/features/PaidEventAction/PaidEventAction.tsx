'use client';

import {Event, Ticket, User} from '@prisma/client';
import {useState} from 'react';
import {useForm} from 'react-hook-form';
import {Badge, Button} from 'ui';
import {formatCents} from 'utils';
import {TicketSelectorModal} from '../TicketSelectorModal/TicketSelectorModal';
import {api} from '../../../../../../apps/web/src/trpc/client';
import {useRouter} from 'next/navigation';

interface Props {
  event: Event & {tickets: Ticket[]} & {isPast: boolean};
  myTicketPromise: ReturnType<typeof api.event.getMyTicketsByEvent.query>;
  me: User | null;
}

export function PaidEventAction({event, myTicketPromise, me}: Props) {
  const router = useRouter();
  const [isTicketSelectorModalOpen, setIsTicketSelectorModalOpen] =
    useState(false);
  const form = useForm();

  const onJoinSubmit = form.handleSubmit(async (data) => {
    if (!me) {
      router.push('/sign-in');
    }

    if (event.tickets.length > 0) {
      setIsTicketSelectorModalOpen(true);
      return;
    }
  });

  const formattedPrice = formatCents(
    event.tickets[0].price,
    event.preferredCurrency
  );

  return (
    <>
      <TicketSelectorModal
        me={me}
        isOpen={isTicketSelectorModalOpen}
        onClose={() => setIsTicketSelectorModalOpen(false)}
        onDone={() => {}}
        event={event}
      />
      <form
        className="flex items-center gap-x-2 w-full"
        onSubmit={onJoinSubmit}
      >
        <Button
          type="submit"
          disabled={form.formState.isSubmitting || event.isPast}
          isLoading={form.formState.isSubmitting}
          size="sm"
          data-testid="buy-ticket-button"
        >
          {`Buy ticket`}
        </Button>
        <Badge
          variant={'outline'}
          className="hidden md:flex"
        >{`from ${formattedPrice}`}</Badge>
      </form>
    </>
  );
}
