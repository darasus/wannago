import {useAuth} from '@clerk/nextjs';
import {Event} from '@prisma/client';
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
import {Badge, Button} from 'ui';
import {Switch} from '../../../../../../apps/web/src/components/Input/Switch/Switch';
import {AuthModal} from '../AuthModal/AuthModal';

interface Props {
  event: Event;
}

interface EventSignUpForm {
  hasPlusOne: boolean;
}

export function FreeEventAction({event}: Props) {
  const {confetti} = useConfetti();
  const {logEvent} = useAmplitude();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
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
  const cancelEventSignUp = trpc.event.cancelEvent.useMutation({
    onError(error) {
      toast.error(error.message);
    },
    onSuccess: () => {
      logEvent('event_sign_up_cancel_submitted', {
        eventId: event.id,
      });
      toast.success('Sign up is cancelled!');
    },
  });
  const {modal: cancelModal, open: openCancelModal} = useConfirmDialog({
    title: 'Confirm cancellation',
    description: 'Are you sure you want to cancel your attendance?',
    onConfirm: async () => {
      await cancelEventSignUp.mutateAsync({
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

  if (amSignedUp) {
    return (
      <>
        {cancelModal}
        <form className="flex items-center gap-x-4" onSubmit={onCancelSubmit}>
          <div className="flex items-center gap-x-2">
            <Badge
              size="xs"
              color="green"
              data-testid="event-signup-success-label"
            >{`You're signed up!`}</Badge>
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              isLoading={form.formState.isSubmitting}
              variant="neutral"
              size="sm"
              data-testid="cancel-signup-button"
            >
              Cancel
            </Button>
          </div>
        </form>
      </>
    );
  }
  if (amInvited) {
    return (
      <form className="flex items-center gap-x-4" onSubmit={onJoinSubmit}>
        <div className="flex items-center gap-x-2">
          <Badge
            size="xs"
            color="yellow"
            data-testid="event-signup-success-label"
          >{`You're invited!`}</Badge>
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            isLoading={form.formState.isSubmitting}
            variant="neutral"
            size="sm"
            data-testid="cancel-signup-button"
          >
            Accept invite
          </Button>
        </div>
      </form>
    );
  }

  return (
    <>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onDone={onJoinSubmit}
      />
      <form
        className="flex items-center gap-x-4 w-full"
        onSubmit={onJoinSubmit}
      >
        <div>
          <Switch
            name="hasPlusOne"
            control={form.control}
            defaultValue={form.formState.defaultValues?.hasPlusOne || false}
          >
            <span>
              <span className="hidden md:inline">Bring </span>+1
            </span>
          </Switch>
        </div>
        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          isLoading={form.formState.isSubmitting}
          size="sm"
          data-testid="attend-button"
        >
          Attend
        </Button>
      </form>
    </>
  );
}
