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
  event: Event & {tickets: Ticket[]};
}

export function PaidEventAction({event}: Props) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isTicketSelectorModalOpen, setIsTicketSelectorModalOpen] =
    useState(false);
  const auth = useAuth();
  const form = useForm();
  const myTickets = use(
    api.event.getMyTicketsByEvent.query({
      eventShortId: event.shortId,
    })
  );

  const onJoinSubmit = form.handleSubmit(async data => {
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
        isOpen={isTicketSelectorModalOpen}
        onClose={() => setIsTicketSelectorModalOpen(false)}
        onDone={() => {}}
        event={event}
      />
      <form
        className="flex items-center gap-x-2 w-full"
        onSubmit={onJoinSubmit}
      >
        {myTickets && myTickets?.length > 0 && (
          <Button
            size="sm"
            variant="neutral"
            data-testid="my-tickets-button"
            as="a"
            href={`/e/${event.shortId}/my-tickets`}
          >
            {`My tickets`}
          </Button>
        )}
        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          isLoading={form.formState.isSubmitting}
          size="sm"
          data-testid="buy-ticket-button"
        >
          {`Buy ticket`}
        </Button>
        <Badge
          className="hidden md:flex"
          size="sm"
        >{`from ${formattedPrice}`}</Badge>
      </form>
    </>
  );
}
