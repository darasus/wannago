'use client';

import {useAuth, useSignIn} from '@clerk/nextjs';
import {ClerkAPIError} from '@clerk/types';
import {useRouter} from 'next/navigation';
import {useCallback, useEffect, useState} from 'react';
import {FormProvider, useForm, useFormContext} from 'react-hook-form';
import {
  CardBase,
  LoadingBlock,
  Button,
  Text,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  Input,
  FormMessage,
  FormDescription,
} from 'ui';
import {cn, sleep} from 'utils';
import {titleFont} from '../../../../apps/web/src/fonts';
import {z} from 'zod';

const emailFormScheme = z.object({
  email: z.string().email(),
});
const codeFormScheme = z.object({
  code: z.string().length(6),
});

export interface APIResponseError {
  errors: ClerkAPIError[];
}

interface Props {
  onDone?: () => void;
  onCreateAccountClick?: () => void;
}

export function Login({onDone, onCreateAccountClick}: Props) {
  const router = useRouter();
  const {getToken} = useAuth();
  const {setSession, isLoaded} = useSignIn();
  const [step, setStep] = useState<'email' | 'code'>('email');
  const emailForm = useForm<z.infer<typeof emailFormScheme>>();
  const codeForm = useForm<z.infer<typeof codeFormScheme>>({
    mode: 'onSubmit',
  });

  const ready = useCallback(async (): Promise<any> => {
    const token = await getToken();

    if (!token) {
      await sleep(1000);
      return ready();
    }
  }, [getToken]);

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
      <Button onClick={handleLoginClick} variant="outline">
        Create account
      </Button>
    </div>
  );
}

interface EmailFormProps {
  goToNextStep: () => void;
}

function EmailForm({goToNextStep}: EmailFormProps) {
  const form = useFormContext<z.infer<typeof emailFormScheme>>();
  const {signIn} = useSignIn();

  const submit = form.handleSubmit(async (data) => {
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
    <Form {...form}>
      <form onSubmit={submit}>
        <div className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({field}) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    data-testid="login-email-input"
                    autoComplete="email"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            isLoading={form.formState.isSubmitting}
            data-testid="login-email-form-submit"
          >
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}

interface CodeFormProps {
  email: string;
  onDone: (createdSessionId: string) => Promise<void>;
}

function CodeForm({onDone, email}: CodeFormProps) {
  const form = useFormContext<z.infer<typeof codeFormScheme>>();
  const code = form.watch('code');
  const {signIn} = useSignIn();

  const submit = form.handleSubmit(async (data) => {
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
    <Form {...form}>
      <form onSubmit={submit}>
        <div className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="code"
            render={({field}) => (
              <FormItem>
                <FormLabel>Code</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    data-testid="login-code-input"
                    autoComplete="off"
                    type="number"
                  />
                </FormControl>
                <FormDescription>{`We sent code to ${email}`}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            isLoading={form.formState.isSubmitting}
            data-testid="login-code-form-submit"
          >
            Submit
          </Button>
        </div>
      </form>
    </Form>
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
