import {useAuth} from '@clerk/nextjs';
import {Event, Ticket} from '@prisma/client';
import {SignUpCard as _SignUpCard} from 'cards';
import {
  useAmplitude,
  useAttendeeCount,
  useConfetti,
  useConfirmDialog,
} from 'hooks';
import {useState} from 'react';
import {FormProvider, useForm} from 'react-hook-form';
import {toast} from 'react-hot-toast';
import {trpc} from 'trpc/src/trpc';
import {Container} from 'ui';
import {AuthModal} from './features/AuthModal/AuthModal';
import {TicketSelectorModal} from './features/TicketSelectorModal/TicketSelectorModal';

interface Props {
  event: Event & {tickets: Ticket[]};
}

interface EventSignUpForm {
  hasPlusOne: boolean;
}

export function SignUpCard({event}: Props) {
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
  const form = useForm<EventSignUpForm>();
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

  const onCancelSubmit = form.handleSubmit(async () => {
    openCancelModal();
  });

  const amSignedUp = Boolean(signUp && signUp.data?.status === 'REGISTERED');
  const amInvited = Boolean(signUp && signUp.data?.status === 'INVITED');

  return (
    <>
      {cancelModal}
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
      <Container className="w-full p-0 m-0">
        <FormProvider {...form}>
          <_SignUpCard
            amSignedUp={amSignedUp}
            amInvited={amInvited}
            onJoinSubmit={onJoinSubmit}
            onCancelSubmit={onCancelSubmit}
            isPublished={event.isPublished}
            numberOfAttendees={attendeeCount?.data?.count ?? 0}
            isLoading={signUp.isLoading}
            minimumPrice={event.tickets[0]?.price}
          />
        </FormProvider>
      </Container>
    </>
  );
}
