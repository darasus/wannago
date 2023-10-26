'use client';

import {Event, SignUpProtection, Ticket} from '@prisma/client';
import {useState} from 'react';
import {useForm} from 'react-hook-form';
import {Badge, Button} from 'ui';
import {formatCents} from 'utils';
import {TicketSelectorModal} from '../TicketSelectorModal/TicketSelectorModal';
import {api} from '../../../../../../apps/web/src/trpc/client';
import {useMe} from 'hooks';
import {useRouter} from 'next/navigation';
import {SignUpCodeModal} from './features/SignUpCodeModal/SignUpCodeModal';

interface Props {
  event: Event & {tickets: Ticket[]} & {isPast: boolean};
  mePromise: ReturnType<typeof api.user.me.query>;
}

export function PaidEventAction({event, mePromise}: Props) {
  const router = useRouter();
  const [isTicketSelectorModalOpen, setIsTicketSelectorModalOpen] =
    useState(false);
  const [isSignUpCodeModalOpen, setIsSignUpCodeModalOpen] = useState(false);
  const me = useMe();
  const form = useForm();

  const isEventSignUpPublic =
    event.signUpProtection === SignUpProtection.PUBLIC;
  const isEventSignUpProtected =
    event.signUpProtection === SignUpProtection.PROTECTED;

  const onJoinSubmit = form.handleSubmit(async (data) => {
    if (!me) {
      router.push('/sign-in');
    }

    if (isEventSignUpProtected) {
      setIsSignUpCodeModalOpen(true);
      return;
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
        mePromise={mePromise}
        isOpen={isTicketSelectorModalOpen}
        onClose={() => setIsTicketSelectorModalOpen(false)}
        onDone={() => {}}
        event={event}
      />
      <SignUpCodeModal
        isOpen={isSignUpCodeModalOpen}
        onOpenChange={() => setIsSignUpCodeModalOpen(!isSignUpCodeModalOpen)}
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
