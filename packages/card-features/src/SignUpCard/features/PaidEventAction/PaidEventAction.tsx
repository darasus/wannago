'use client';

import {Event, SignUpProtection, Ticket} from '@prisma/client';
import {useForm} from 'react-hook-form';
import {Badge, Button} from 'ui';
import {formatCents} from 'utils';
import {TicketSelectorModal} from './features/TicketSelectorModal/TicketSelectorModal';
import {api} from '../../../../../../apps/web/src/trpc/client';
import {useMe} from 'hooks';
import {useRouter} from 'next/navigation';
import {SignUpCodeModal} from './features/SignUpCodeModal/SignUpCodeModal';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {formScheme} from './validation';
import {useModalState} from './hooks/useModalState';
import {LockIcon} from 'lucide-react';

interface Props {
  event: Event & {tickets: Ticket[]} & {isPast: boolean; isMyEvent: boolean};
  mePromise: ReturnType<typeof api.user.me.query>;
}

export function PaidEventAction({event, mePromise}: Props) {
  const router = useRouter();
  const {
    isSignUpCodeModalOpen,
    isTicketSelectorModalOpen,
    closeTicketSelectorModal,
    onSignUpCodeModalOpenChange,
    openSignUpCodeModal,
    openTicketSelectorUpModal,
  } = useModalState();
  const me = useMe();
  const form = useForm<z.infer<typeof formScheme>>({
    resolver: zodResolver(formScheme),
    defaultValues: {
      tickets: event.tickets.reduce((acc, ticket) => {
        return {...acc, [ticket.id]: 0};
      }, {}),
    },
  });

  const isEventSignUpPublic =
    event.signUpProtection === SignUpProtection.PUBLIC;
  const isEventSignUpProtected =
    event.signUpProtection === SignUpProtection.PROTECTED;

  const openTicketSelector = form.handleSubmit(async (data) => {
    if (!me) {
      router.push('/sign-in');
      return;
    }

    if (!event.isMyEvent && isEventSignUpProtected) {
      openSignUpCodeModal();
      return;
    }

    if (event.tickets.length > 0) {
      openTicketSelectorUpModal();
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
        onClose={() => closeTicketSelectorModal()}
        event={event}
      />
      <SignUpCodeModal
        isOpen={isSignUpCodeModalOpen}
        onOpenChange={onSignUpCodeModalOpenChange}
        eventShortId={event.shortId}
      />
      <form onSubmit={openTicketSelector}>
        <div className="flex items-center gap-x-2 w-full">
          <Button
            disabled={form.formState.isSubmitting || event.isPast}
            isLoading={form.formState.isSubmitting}
            size="sm"
            data-testid="buy-ticket-button"
            type="submit"
          >
            {isEventSignUpProtected && <LockIcon className="mr-2 w-4 h-4" />}
            {`Buy ticket`}
          </Button>
          <Badge
            variant={'outline'}
            className="hidden md:flex"
          >{`from ${formattedPrice}`}</Badge>
        </div>
      </form>
    </>
  );
}
