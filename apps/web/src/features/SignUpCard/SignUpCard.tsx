import {RedirectToSignIn} from '@clerk/nextjs';
import {Event} from '@prisma/client';
import {SignUpCard as _SignUpCard} from 'cards';
import {useAmplitude, useAttendeeCount, useConfetti} from 'hooks';
import {useState} from 'react';
import {FormProvider, useForm} from 'react-hook-form';
import {toast} from 'react-hot-toast';
import {trpc} from 'trpc/src/trpc';
import {Container} from 'ui';
import {getBaseUrl} from 'utils';

interface Props {
  event: Event;
}

interface EventSignUpForm {
  hasPlusOne: boolean;
}

export function SignUpCard({event}: Props) {
  const {confetti} = useConfetti();
  const {logEvent} = useAmplitude();
  const [isOpen, setIsOpen] = useState(false);
  const {data: me} = trpc.me.me.useQuery(undefined, {
    useErrorBoundary: false,
    suspense: false,
  });
  const signUp = trpc.event.getSignUp.useQuery(
    {eventId: event.id},
    {
      useErrorBoundary: false,
      suspense: false,
    }
  );
  const join = trpc.event.join.useMutation({
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
  const cancelRsvp = trpc.event.cancelRsvp.useMutation({
    onError(error) {
      toast.error(error.message);
    },
    onSuccess: () => {
      logEvent('event_sign_up_cancel_submitted', {
        eventId: event.id,
      });
      toast.success('Cancelled! Check your email for more details!');
    },
  });
  const form = useForm<EventSignUpForm>();
  const attendeeCount = useAttendeeCount({
    eventId: event.id,
  });

  const onJoinSubmit = form.handleSubmit(async data => {
    if (!me) {
      setIsOpen(true);
      return;
    }

    try {
      await join.mutateAsync({
        eventId: event.id,
        ...data,
        email: me?.email,
        firstName: me?.firstName,
        lastName: me?.lastName,
        hasPlusOne: data.hasPlusOne,
      });
      await Promise.all([signUp.refetch(), attendeeCount.refetch()]);
    } catch (error) {}
  });

  const onCancelSubmit = form.handleSubmit(async () => {
    if (!me) {
      setIsOpen(true);
      return;
    }

    try {
      await cancelRsvp.mutateAsync({
        eventId: event.id,
        userId: me.id,
      });
      await Promise.all([signUp.refetch(), attendeeCount.refetch()]);
    } catch (error) {}
  });

  const amSignedUp = Boolean(
    !signUp ||
      signUp?.data?.status === 'INVITED' ||
      signUp?.data?.status === 'REGISTERED'
  );

  return (
    <>
      {isOpen && (
        <RedirectToSignIn redirectUrl={`${getBaseUrl()}/e/${event.shortId}`} />
      )}
      <Container className="sticky bottom-4 w-full p-0 m-0">
        <FormProvider {...form}>
          <_SignUpCard
            amSignedUp={amSignedUp}
            onJoinSubmit={onJoinSubmit}
            onCancelSubmit={onCancelSubmit}
            isPublished={event.isPublished}
            numberOfAttendees={attendeeCount?.data?.count ?? 0}
          />
        </FormProvider>
      </Container>
    </>
  );
}
