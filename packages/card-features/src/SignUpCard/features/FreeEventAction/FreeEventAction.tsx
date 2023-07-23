'use client';

import {useAuth} from '@clerk/nextjs';
import {Event} from '@prisma/client';
import {useAmplitude, useConfetti, useConfirmDialog} from 'hooks';
import {use, useState} from 'react';
import {useForm} from 'react-hook-form';
import {toast} from 'react-hot-toast';
import {
  Badge,
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Switch,
} from 'ui';
import {AuthModal} from '../AuthModal/AuthModal';
import {useRouter} from 'next/navigation';
import {RouterOutputs} from 'api';
import {api} from '../../../../../../apps/web/src/trpc/client';

interface EventSignUpForm {
  hasPlusOne: boolean;
}

interface Props {
  event: Event & {isPast: boolean};
  mySignUpPromise: Promise<RouterOutputs['event']['getMySignUp']>;
}

export function FreeEventAction({event, mySignUpPromise}: Props) {
  const router = useRouter();
  const {confetti} = useConfetti();
  const {logEvent} = useAmplitude();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const auth = useAuth();
  const signUp = use(mySignUpPromise);

  const {modal: cancelModal, open: openCancelModal} = useConfirmDialog({
    title: 'Confirm cancellation',
    description: 'Are you sure you want to cancel your attendance?',
    onConfirm: async () => {
      await api.event.cancelEvent
        .mutate({
          eventId: event.id,
        })
        .then(async () => {
          router.refresh();
          logEvent('event_sign_up_cancel_submitted', {
            eventId: event.id,
          });
          toast.success('Sign up is cancelled!');
        })
        .catch((error) => {
          toast.error(error.message);
        });
    },
  });
  const form = useForm<EventSignUpForm>({
    defaultValues: {
      hasPlusOne: false,
    },
  });

  const onJoinSubmit = form.handleSubmit(async (data) => {
    if (!auth.isSignedIn) {
      const token = await auth.getToken();

      if (!token) {
        setIsAuthModalOpen(true);
        return;
      }
    }

    await api.event.joinEvent
      .mutate({
        eventId: event.id,
        hasPlusOne: data.hasPlusOne,
      })
      .then(async () => {
        router.refresh();
        toast.success('Signed up! Check your email for more details!');
        confetti();
        logEvent('event_sign_up_submitted', {
          eventId: event.id,
        });
      })
      .catch((error) => {
        toast.error(error.message);
      });
  });

  const onCancelSubmit = form.handleSubmit(async () => {
    openCancelModal();
  });

  const amSignedUp = Boolean(signUp && signUp?.status === 'REGISTERED');
  const amInvited = Boolean(signUp && signUp?.status === 'INVITED');

  if (amSignedUp) {
    return (
      <>
        {cancelModal}
        <form className="flex items-center gap-x-4" onSubmit={onCancelSubmit}>
          <div className="flex items-center gap-x-2">
            <Badge data-testid="event-signup-success-label">{`You're signed up!`}</Badge>
            <Button
              type="submit"
              disabled={form.formState.isSubmitting || event.isPast}
              variant="outline"
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
            variant={'outline'}
            data-testid="event-signup-success-label"
          >{`You're invited!`}</Badge>
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            variant="outline"
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
      <Form {...form}>
        <form
          className="flex items-center gap-x-4 w-full"
          onSubmit={onJoinSubmit}
        >
          <div>
            <FormField
              name="hasPlusOne"
              control={form.control}
              render={({field}) => {
                return (
                  <FormItem className="flex items-center space-y-0 gap-1">
                    <FormControl>
                      <Switch
                        id="bring-one"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel htmlFor="bring-one">
                      <span className="hidden md:inline">Bring </span>+1
                    </FormLabel>
                  </FormItem>
                );
              }}
            />
          </div>
          <Button
            type="submit"
            disabled={form.formState.isSubmitting || event.isPast}
            isLoading={form.formState.isSubmitting}
            size="sm"
            data-testid="attend-button"
          >
            Attend
          </Button>
        </form>
      </Form>
    </>
  );
}
