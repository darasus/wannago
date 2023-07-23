'use client';

import {useSignIn} from '@clerk/nextjs';
import {useCallback, useState} from 'react';
import {FormProvider, useForm} from 'react-hook-form';
import {CardBase, LoadingBlock, Button, Text} from 'ui';
import {cn, sleep} from 'utils';
import {titleFont} from '../../../../apps/web/src/fonts';
import {z} from 'zod';
import {codeFormScheme, emailFormScheme} from '../shared';
import {CodeForm} from './features/CodeForm/CodeForm';
import {EmailForm} from './features/EmailForm/EmailForm';
import {SignUpWithGoogleButton} from '../SignUpWithGoogleButton/SignUpWithGoogleButton';
import Link from 'next/link';
import {api} from '../../../../apps/web/src/trpc/client';

interface Props {
  onDone?: () => void;
  onCreateAccountClick?: () => void;
  redirectUrlComplete?: string;
}

export function Login({
  onDone,
  onCreateAccountClick,
  redirectUrlComplete,
}: Props) {
  const {setSession, isLoaded} = useSignIn();
  const [step, setStep] = useState<'email' | 'code'>('email');
  const emailForm = useForm<z.infer<typeof emailFormScheme>>({
    defaultValues: {
      email: '',
    },
  });
  const codeForm = useForm<z.infer<typeof codeFormScheme>>({
    mode: 'onSubmit',
    defaultValues: {
      code: '',
    },
  });

  const ready = useCallback(async (): Promise<any> => {
    const me = await api.user.me.query();

    if (!me) {
      await sleep(1000);
      return ready();
    }
  }, []);

  const handleOnDone = useCallback(
    async (createdSessionId: string) => {
      await setSession?.(createdSessionId);
      await ready();

      if (onDone) {
        onDone?.();
      } else {
        window.location.href = '/dashboard';
      }
    },
    [ready, setSession, onDone]
  );

  return (
    <div className="flex flex-col items-center gap-4">
      <Text className={cn('text-4xl', titleFont.className)}>Login</Text>
      <CardBase className="w-full">
        {isLoaded ? (
          <>
            {step === 'email' && (
              <FormProvider {...emailForm}>
                <EmailForm goToNextStep={() => setStep('code')} />
              </FormProvider>
            )}
            {step === 'code' && (
              <FormProvider {...codeForm}>
                <CodeForm
                  onDone={handleOnDone}
                  email={emailForm.watch('email')}
                />
              </FormProvider>
            )}
          </>
        ) : (
          <LoadingBlock />
        )}
      </CardBase>
      <div className="relative w-full">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <SignUpWithGoogleButton redirectUrlComplete={redirectUrlComplete} />
      <div>
        {onCreateAccountClick ? (
          <Button variant={'link'} onClick={onCreateAccountClick}>
            Go to register
          </Button>
        ) : (
          <Button asChild variant={'link'}>
            <Link href="/register">Go to register</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
