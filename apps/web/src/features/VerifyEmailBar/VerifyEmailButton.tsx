'use client';

import {useTransition} from 'react';
import {api} from '../../trpc/client';
import {toast} from 'sonner';
import {Button} from 'ui';

export function VerifyEmailButton() {
  const [isPending, startTransition] = useTransition();
  const resend = async () => {
    startTransition(async () => {
      await api.auth.sendEmailVerificationEmail
        .mutate()
        .then(async () => {
          toast.success('Email sent!');
        })
        .catch((err) => {
          toast.error(err.message);
        });
    });
  };

  return (
    <Button
      size={'sm'}
      variant={'link'}
      className="p-0 underline"
      onClick={resend}
      isLoading={isPending}
      disabled={isPending}
    >
      Resend
    </Button>
  );
}
