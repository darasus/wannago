'use client';

import {useSignIn} from '@clerk/nextjs';
import {ClerkAPIError} from '@clerk/types';
import {useRouter} from 'next/navigation';
import {use, useCallback, useEffect, useState} from 'react';
import {FormProvider, useForm, useFormContext} from 'react-hook-form';
import {CardBase, LoadingBlock, Button, Text} from 'ui';
import {cn, sleep} from 'utils';
import {Input} from '../../../../apps/web/src/components/Input/Input/Input';
import {titleFont} from '../../../../apps/web/src/fonts';
import {api} from '../../../../apps/web/src/trpc/client';

interface TEmailForm {
  email: string;
}

interface TCodeForm {
  code: string;
}

export interface APIResponseError {
  errors: ClerkAPIError[];
}

interface Props {
  onDone?: () => void;
  onCreateAccountClick?: () => void;
  redirectToDashboard?: boolean;
}

export function Login({
  onDone,
  onCreateAccountClick,
  redirectToDashboard,
}: Props) {
  const router = useRouter();
  const me = use(api.user.me.query());
  const {setSession, isLoaded} = useSignIn();
  const [step, setStep] = useState<'email' | 'code'>('email');
  const emailForm = useForm<TEmailForm>();
  const codeForm = useForm<TCodeForm>({
    mode: 'onSubmit',
  });

  const ready = useCallback(async (): Promise<any> => {
    const data = await api.user.me.query();

    if (!data?.id) {
      await sleep(1000);
      return ready();
    }
  }, []);

  const handleOnDone = useCallback(
    async (createdSessionId: string) => {
      await setSession?.(createdSessionId);
      await ready();

      onDone?.();
    },
    [ready, setSession, onDone]
  );

  const handleLoginClick = useCallback(() => {
    if (onCreateAccountClick) {
      onCreateAccountClick();
    } else {
      router.push('/register');
    }
  }, [router, onCreateAccountClick]);

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
      <Text className="text-center">- OR -</Text>
      <Button onClick={handleLoginClick} variant="neutral">
        Create account
      </Button>
    </div>
  );
}

interface EmailFormProps {
  goToNextStep: () => void;
}

function EmailForm({goToNextStep}: EmailFormProps) {
  const form = useFormContext<TEmailForm>();
  const {signIn} = useSignIn();

  const submit = form.handleSubmit(async data => {
    try {
      await signIn?.create({
        identifier: data.email,
        strategy: 'email_code',
      });
      goToNextStep();
    } catch (error: any) {
      const e = error as APIResponseError;

      form.setError('email', {
        type: 'manual',
        message: parseError(e),
      });
    }
  });

  useEffect(() => {
    form.setFocus('email');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <form onSubmit={submit}>
      <div className="flex flex-col gap-4">
        <Input
          type="email"
          label="Email"
          {...form.register('email', {
            required: {
              value: true,
              message: 'Email is required',
            },
          })}
          error={form.formState.errors.email}
          autoComplete="email"
          data-testid="login-email-input"
        />
        <Button
          type="submit"
          isLoading={form.formState.isSubmitting}
          data-testid="login-email-form-submit"
        >
          Submit
        </Button>
      </div>
    </form>
  );
}

interface CodeFormProps {
  email: string;
  onDone: (createdSessionId: string) => Promise<void>;
}

function CodeForm({onDone, email}: CodeFormProps) {
  const form = useFormContext<TCodeForm>();
  const code = form.watch('code');
  const {signIn} = useSignIn();

  const submit = form.handleSubmit(async data => {
    try {
      const signInAttempt = await signIn?.attemptFirstFactor({
        strategy: 'email_code',
        code: data.code,
      });

      if (
        signInAttempt?.status === 'complete' &&
        signInAttempt?.createdSessionId
      ) {
        await onDone(signInAttempt?.createdSessionId);
      }
    } catch (error: any) {
      form.setError('code', {
        type: 'manual',
        message: parseError(error as APIResponseError),
      });
    }
  });

  useEffect(() => {
    form.setFocus('code');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (code?.length === 6) {
      submit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  return (
    <form onSubmit={submit}>
      <div className="flex flex-col gap-4">
        <Input
          type="number"
          description={`Enter the code sent to ${email}`}
          label="Code"
          {...form.register('code', {
            validate: value => {
              try {
                if (!value) return 'Code is required';

                if (typeof value === 'string') {
                  const length = value.length;
                  if (length > 6 || length < 6) {
                    return 'Code must be 6 characters long';
                  }
                }
                const n = Number(value);

                if (typeof n === 'number' && !isNaN(n)) {
                  return true;
                } else {
                  return 'Code must be a number';
                }
              } catch (error) {
                return 'Code must be a number';
              }
            },
          })}
          error={form.formState.errors.code}
          autoComplete="off"
          data-testid="login-code-input"
        />

        <Button
          type="submit"
          isLoading={form.formState.isSubmitting}
          data-testid="login-code-form-submit"
        >
          Submit
        </Button>
      </div>
    </form>
  );
}

export function parseError(err: APIResponseError): string {
  if (!err) {
    return '';
  }

  if (err.errors) {
    return err.errors[0].longMessage || '';
  }

  throw err;
}
