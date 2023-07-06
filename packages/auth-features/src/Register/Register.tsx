'use client';

import {useAuth, useSignUp} from '@clerk/nextjs';
import {useCallback, useState} from 'react';
import {FormProvider, useForm} from 'react-hook-form';
import {Button, CardBase, LoadingBlock, Text} from 'ui';
import {cn, sleep} from 'utils';
import {titleFont} from '../../../../apps/web/src/fonts';
import {z} from 'zod';
import {codeFormScheme, infoFormScheme} from '../shared';
import {UserForm} from './features/UserForm/UserForm';
import {CodeForm} from './features/CodeForm/CodeForm';
import {SignUpWithGoogleButton} from '../SignUpWithGoogleButton/SignUpWithGoogleButton';
import Link from 'next/link';

interface Props {
  onDone?: () => void;
  onLoginClick?: () => void;
  redirectUrlComplete?: string;
}

export function Register({onDone, onLoginClick, redirectUrlComplete}: Props) {
  const {setSession, isLoaded} = useSignUp();
  const {getToken} = useAuth();

  const [step, setStep] = useState<'user_info' | 'code'>('user_info');
  const userInfoForm = useForm<z.infer<typeof infoFormScheme>>({
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
    },
  });
  const codeForm = useForm<z.infer<typeof codeFormScheme>>({
    mode: 'onSubmit',
    defaultValues: {
      code: '',
    },
  });

  const ready = useCallback(async (): Promise<any> => {
    const token = await getToken();

    if (!token) {
      await sleep(1000);
      return ready();
    }
  }, [getToken]);

  const handleOnDone = async (createdSessionId: string): Promise<any> => {
    await setSession?.(createdSessionId);
    await ready();

    if (onDone) {
      onDone?.();
    } else {
      window.location.href = '/dashboard';
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Text className={cn('text-4xl', titleFont.className)}>Register</Text>
      <CardBase className="w-full">
        {isLoaded ? (
          <>
            {step === 'user_info' && (
              <FormProvider {...userInfoForm}>
                <UserForm goToNextStep={() => setStep('code')} />
              </FormProvider>
            )}
            {step === 'code' && (
              <FormProvider {...codeForm}>
                <CodeForm
                  onDone={handleOnDone}
                  email={userInfoForm.watch('email')}
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
        {onLoginClick ? (
          <Button onClick={onLoginClick} variant={'link'}>
            Go to login
          </Button>
        ) : (
          <Button asChild variant={'link'}>
            <Link href="/login">Go to login</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
