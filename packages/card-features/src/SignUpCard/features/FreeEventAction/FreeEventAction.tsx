'use client';

import {Event} from '@prisma/client';
import {use} from 'react';
import {FormProvider, useForm} from 'react-hook-form';

import {RouterOutputs} from 'api';
import {EventSignUpForm} from './types';
import {AcceptInviteButton} from './features/AcceptInviteButton/AcceptInviteButton';
import {CancelSignUpButton} from './features/CancelSignUpButton/CancelSignUpButton';
import {SignUpButton} from './features/SignUpButton/SignUpButton';

interface Props {
  event: Event & {isPast: boolean};
  mySignUpPromise: Promise<RouterOutputs['event']['getMySignUp']>;
}

export function FreeEventAction({event, mySignUpPromise}: Props) {
  const signUp = use(mySignUpPromise);
  const form = useForm<EventSignUpForm>({
    defaultValues: {
      hasPlusOne: false,
    },
  });

  const amSignedUp = Boolean(signUp && signUp?.status === 'REGISTERED');
  const amInvited = Boolean(signUp && signUp?.status === 'INVITED');

  if (amSignedUp) {
    return (
      <FormProvider {...form}>
        <CancelSignUpButton event={event} />
      </FormProvider>
    );
  }

  if (amInvited) {
    return (
      <FormProvider {...form}>
        <AcceptInviteButton event={event} />
      </FormProvider>
    );
  }

  return (
    <FormProvider {...form}>
      <SignUpButton event={event} />
    </FormProvider>
  );
}
