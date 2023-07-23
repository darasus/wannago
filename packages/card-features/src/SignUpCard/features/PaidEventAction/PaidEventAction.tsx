'use client';

import {useAuth} from '@clerk/nextjs';
import {Event, Ticket} from '@prisma/client';
import {use, useState} from 'react';
import {useForm} from 'react-hook-form';
import {Badge, Button} from 'ui';
import {formatCents} from 'utils';
import {AuthModal} from '../AuthModal/AuthModal';
import {TicketSelectorModal} from '../TicketSelectorModal/TicketSelectorModal';
import {api} from '../../../../../../apps/web/src/trpc/client';

interface Props {
  event: Event & {tickets: Ticket[]} & {isPast: boolean};
  myTicketPromise: ReturnType<typeof api.event.getMyTicketsByEvent.query>;
  mePromise: ReturnType<typeof api.user.me.query>;
}

export function PaidEventAction({event, myTicketPromise, mePromise}: Props) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isTicketSelectorModalOpen, setIsTicketSelectorModalOpen] =
    useState(false);
  const auth = useAuth();
  const form = useForm();
  const myTickets = use(myTicketPromise);

  const onJoinSubmit = form.handleSubmit(async (data) => {
    if (!auth.isSignedIn) {
      const token = await auth.getToken();

      if (!token) {
        setIsAuthModalOpen(true);
        return;
      }
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
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onDone={() => setIsTicketSelectorModalOpen(true)}
      />
      <TicketSelectorModal
        mePromise={mePromise}
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
