'use client';

import {Event} from '@prisma/client';
import {useAmplitude, useConfetti, useConfirmDialog, useMe} from 'hooks';
import {use} from 'react';
import {useForm} from 'react-hook-form';
import {toast} from 'sonner';
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
import {useRouter} from 'next/navigation';
import {RouterOutputs} from 'api';
import {api} from '../../../../../../apps/web/src/trpc/client';
import {revalidateGetMySignUp} from '../../../../../../apps/web/src/actions';

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
  const me = useMe();
  const signUp = use(mySignUpPromise);

  const {modal: cancelModal, open: openCancelModal} = useConfirmDialog({
    title: 'Confirm cancellation',
    description: 'Are you sure you want to cancel your attendance?',
    onConfirm: async () => {
      const promise = api.event.cancelEvent
        .mutate({
          eventId: event.id,
        })
        .then(async () => {
          await revalidateGetMySignUp({eventId: event.id});
          router.refresh();
          logEvent('event_sign_up_cancel_submitted', {
            eventId: event.id,
          });
        });

      toast.promise(promise, {
        loading: 'Cancelling sign up...',
        success: 'Sign up is cancelled!',
        error: (error) => error.message,
      });

      try {
        await promise;
      } catch (error) {}
    },
  });
  const form = useForm<EventSignUpForm>({
    defaultValues: {
      hasPlusOne: false,
    },
  });

  const onJoinSubmit = form.handleSubmit(async (data) => {
    if (!me) {
      router.push('/sign-in');
    }

    const promise = api.event.joinEvent
      .mutate({
        eventId: event.id,
        hasPlusOne: data.hasPlusOne,
      })
      .then(async () => {
        await revalidateGetMySignUp({eventId: event.id});
        router.refresh();
        confetti();
        logEvent('event_sign_up_submitted', {
          eventId: event.id,
        });
      });

    toast.promise(promise, {
      loading: 'Signing up...',
      success: 'Signed up! Check your email for more details.',
      error: (error) => error.message,
    });

    try {
      await promise;
    } catch (error) {}
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
  );
}
