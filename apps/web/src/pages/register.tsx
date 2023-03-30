import {useSignUp} from '@clerk/nextjs';
import Head from 'next/head';
import {useRouter} from 'next/router';
import {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {Button, CardBase, Container, LoadingBlock, Text} from 'ui';
import {cn} from 'utils';
import {Input} from '../components/Input/Input/Input';
import {titleFont} from '../fonts';
import type {ClerkAPIError} from '@clerk/types';

export interface APIResponseError {
  errors: ClerkAPIError[];
}

function RegisterPage() {
  const {setSession, isLoaded} = useSignUp();
  const router = useRouter();
  const [step, setStep] = useState<'user_info' | 'code'>('user_info');

  const handleOnDone = async (createdSessionId: string) => {
    await setSession?.(createdSessionId);
    await new Promise(resolve => {
      setTimeout(() => {
        resolve(true);
      }, 4000);
    });

    router.push('/dashboard');
  };

  return (
    <>
      <Head>
        <title>Sign up | WannaGo</title>
      </Head>
      <Container maxSize="xs" className="py-4">
        <div className="flex flex-col items-center gap-4">
          <Text className={cn('text-4xl', titleFont.className)}>Sign up</Text>
          <CardBase className="w-full">
            {isLoaded ? (
              <>
                {step === 'user_info' && (
                  <UserForm goToNextStep={() => setStep('code')} />
                )}
                {step === 'code' && <CodeForm onDone={handleOnDone} />}
              </>
            ) : (
              <LoadingBlock />
            )}
          </CardBase>
        </div>
      </Container>
    </>
  );
}

export default RegisterPage;

interface TUserForm {
  email: string;
  firstName: string;
  lastName: string;
}

interface UserFormProps {
  goToNextStep: () => void;
}

function UserForm({goToNextStep}: UserFormProps) {
  const {signUp} = useSignUp();
  const form = useForm<TUserForm>({mode: 'onSubmit'});

  const submit = form.handleSubmit(async data => {
    try {
      const signUpAttempt = await signUp?.create({
        emailAddress: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
      });
      await signUpAttempt?.prepareEmailAddressVerification({
        strategy: 'email_code',
      });
      goToNextStep();
    } catch (error: any) {
      const e = error as APIResponseError;

      if (e.errors[0].meta?.paramName === 'email_address') {
        form.setError('email', {
          type: 'manual',
          message: parseError(e),
        });
      }
    }
  });

  useEffect(() => {
    form.setFocus('firstName');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <form onSubmit={submit}>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            type="text"
            label="First name"
            {...form.register('firstName', {
              required: {
                value: true,
                message: 'First name is required',
              },
            })}
            error={form.formState.errors.firstName}
            autoComplete="given-name"
          />
          <Input
            type="text"
            label="Last name"
            {...form.register('lastName', {
              required: {
                value: true,
                message: 'Last name is required',
              },
            })}
            error={form.formState.errors.lastName}
            autoComplete="family-name"
          />
        </div>
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
  onDone: (createdSessionId: string) => Promise<void>;
}

interface TCodeForm {
  code: string;
}

function CodeForm({onDone}: CodeFormProps) {
  const {signUp} = useSignUp();
  const form = useForm<TCodeForm>({
    mode: 'onSubmit',
  });

  const submit = form.handleSubmit(async data => {
    try {
      const signUpAttempt = await signUp?.attemptEmailAddressVerification({
        code: data.code,
      });

      if (
        signUpAttempt?.verifications.emailAddress.status === 'verified' &&
        signUpAttempt.status === 'complete' &&
        signUpAttempt.createdSessionId
      ) {
        await onDone(signUpAttempt.createdSessionId);
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
