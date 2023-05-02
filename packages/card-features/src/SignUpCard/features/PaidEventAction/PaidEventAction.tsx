import {useAuth} from '@clerk/nextjs';
import {Event, Ticket} from '@prisma/client';
import {
  useAmplitude,
  useAttendeeCount,
  useConfetti,
  useConfirmDialog,
} from 'hooks';
import {useState} from 'react';
import {useForm} from 'react-hook-form';
import {toast} from 'react-hot-toast';
import {trpc} from 'trpc/src/trpc';
import {Button, Text} from 'ui';
import {formatCents} from 'utils';
import {AuthModal} from '../AuthModal/AuthModal';
import {TicketSelectorModal} from '../TicketSelectorModal/TicketSelectorModal';

interface Props {
  event: Event & {tickets: Ticket[]};
}

export function PaidEventAction({event}: Props) {
  const {confetti} = useConfetti();
  const {logEvent} = useAmplitude();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isTicketSelectorModalOpen, setIsTicketSelectorModalOpen] =
    useState(false);
  const auth = useAuth();
  const signUp = trpc.event.getMySignUp.useQuery(
    {eventId: event.id},
    {
      retry: false,
      enabled: auth.isSignedIn,
    }
  );
  const joinEvent = trpc.event.joinEvent.useMutation({
    onError(error) {
      toast.error(error.message);
    },
    onSuccess: () => {
      logEvent('event_sign_up_submitted', {
        eventId: event.id,
      });
      toast.success('Signed up! Check your email for more details!');
      confetti();
    },
  });
  const cancelEvent = trpc.event.cancelEvent.useMutation({
    onError(error) {
      toast.error(error.message);
    },
    onSuccess: () => {
      logEvent('event_sign_up_cancel_submitted', {
        eventId: event.id,
      });
      toast.success('Event is cancelled!');
    },
  });
  const {modal: cancelModal, open: openCancelModal} = useConfirmDialog({
    title: 'Confirm cancellation',
    description: 'Are you sure you want to cancel your attendance?',
    onConfirm: async () => {
      await cancelEvent.mutateAsync({
        eventId: event.id,
      });
      await Promise.all([signUp.refetch(), attendeeCount.refetch()]);
    },
  });
  const form = useForm();
  const attendeeCount = useAttendeeCount({
    eventId: event.id,
  });

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

    try {
      await joinEvent.mutateAsync({
        eventId: event.id,
        hasPlusOne: data.hasPlusOne,
      });
      await Promise.all([signUp.refetch(), attendeeCount.refetch()]);
    } catch (error) {}
  });

  return (
    <>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onDone={onJoinSubmit}
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
        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          isLoading={form.formState.isSubmitting}
          size="sm"
          data-testid="attend-button"
        >
          {`But ticket`}
        </Button>
        <Text>{`from ${formatCents(event.tickets[0]?.price || 0)}`}</Text>
      </form>
    </>
  );
}
