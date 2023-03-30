import {useSignIn} from '@clerk/nextjs';
import Head from 'next/head';
import {useRouter} from 'next/router';
import {useEffect, useState} from 'react';
import {
  FormProvider,
  useForm,
  useFormContext,
  UseFormReturn,
} from 'react-hook-form';
import {Button, CardBase, Container, LoadingBlock, Text} from 'ui';
import {cn} from 'utils';
import {Input} from '../components/Input/Input/Input';
import {titleFont} from '../fonts';
import type {ClerkAPIError} from '@clerk/types';

interface TEmailForm {
  email: string;
}

interface TCodeForm {
  code: string;
}

export interface APIResponseError {
  errors: ClerkAPIError[];
}

function RegisterPage() {
  const {setSession, isLoaded} = useSignIn();
  const router = useRouter();
  const [step, setStep] = useState<'email' | 'code'>('email');
  const emailForm = useForm<TEmailForm>({mode: 'onSubmit'});
  const codeForm = useForm<TCodeForm>({mode: 'onSubmit'});

  const handleOnDone = async (createdSessionId: string) => {
    await setSession?.(createdSessionId);

    router.push('/dashboard');
  };

  return (
    <>
      <Head>
        <title>Login | WannaGo</title>
      </Head>
      <Container maxSize="xs" className="py-4">
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
          <Button as="a" href="/register">
            Create account
          </Button>
        </div>
      </Container>
    </>
  );
}

export default RegisterPage;

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
        />
        <Button type="submit" isLoading={form.formState.isSubmitting}>
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
        onDone(signInAttempt?.createdSessionId);
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

  return (
    <form onSubmit={submit}>
      <div className="flex flex-col gap-4">
        <Input
          type="text"
          description={`Enter the code sent to ${email}`}
          label="Code"
          {...form.register('code', {
            required: {
              value: true,
              message: 'Code is required',
            },
            validate: value => {
              try {
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
            maxLength: {
              value: 6,
              message: 'Code must be 6 characters long',
            },
            minLength: {
              value: 6,
              message: 'Code must be 6 characters long',
            },
          })}
          error={form.formState.errors.code}
          onPaste={async () => await form.trigger('code')}
          autoComplete="off"
        />

        <Button type="submit" isLoading={form.formState.isSubmitting}>
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
