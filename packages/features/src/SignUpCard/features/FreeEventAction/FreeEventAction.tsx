'use client';

import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {Event, SignUpProtection} from '@prisma/client';
import {Button, Form} from 'ui';

import {CodeModal} from './features/CodeModal/CodeModal';
import {SignUpModal} from './features/SignUpModal/SignUpModal';
import {useAttendEvent} from './hooks/useAttendEvent';
import {useCodeModalState} from './hooks/useCodeModalState';
import {useSignUpModalState} from './hooks/useSignUpModalState';
import {
  EventSignUpForm,
  EventSignUpWithCodeForm,
  validation,
  validationWithCode,
} from './validation';

interface Props {
  event: Event & {isPast: boolean};
}

export function FreeEventAction({event}: Props) {
  const codeModal = useCodeModalState();
  const signUpModal = useSignUpModalState();
  const form = useForm<EventSignUpForm | EventSignUpWithCodeForm>({
    defaultValues: {
      hasPlusOne: false,
    },
    resolver: zodResolver(
      event.signUpProtectionCode === SignUpProtection.PROTECTED
        ? validationWithCode
        : validation
    ),
  });
  const {attendEvent} = useAttendEvent({event});
  const isEventSignUpPublic =
    event.signUpProtection === SignUpProtection.PUBLIC;
  const isEventSignUpProtected =
    event.signUpProtection === SignUpProtection.PROTECTED;
  const onJoinSubmit = form.handleSubmit(async (data) => {
    if (isEventSignUpProtected) {
    }

    await attendEvent(data);
  });

  return (
    <>
      <CodeModal
        onComplete={() => {
          signUpModal.open();
        }}
      />
      <SignUpModal
        event={event}
        onComplete={() => {
          signUpModal.open();
        }}
      />
      <Form {...form}>
        <form
          className="flex items-center gap-x-4 w-full"
          onSubmit={onJoinSubmit}
        >
          <Button
            disabled={form.formState.isSubmitting || event.isPast}
            isLoading={form.formState.isSubmitting}
            size="sm"
            data-testid="attend-button"
            onClick={() => {
              if (isEventSignUpProtected) {
                codeModal.open();
              }
              if (isEventSignUpPublic) {
                signUpModal.open();
              }
            }}
          >
            Join
          </Button>
        </form>
      </Form>
    </>
  );
}
