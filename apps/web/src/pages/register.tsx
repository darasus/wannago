import {SignUp, useSignUp} from '@clerk/nextjs';
import Head from 'next/head';
import {useRouter} from 'next/router';
import {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {Button, CardBase, Container, Text} from 'ui';
import {cn} from 'utils';
import {Input} from '../components/Input/Input/Input';
import {titleFont} from '../fonts';

function RegisterPage() {
  const {setSession} = useSignUp();
  const router = useRouter();
  const [step, setStep] = useState<'user_info' | 'code'>('user_info');

  const handleOnDone = async (createdSessionId: string) => {
    await setSession?.(createdSessionId);
    await new Promise(resolve => {
      setTimeout(() => {
        resolve(true);
      }, 2000);
    });

    router.push('/dashboard');
  };

  return (
    <>
      <Head>
        <title>Register | WannaGo</title>
      </Head>
      <Container maxSize="xs" className="py-4">
        <div className="flex flex-col items-center gap-4">
          <Text className={cn('text-4xl', titleFont.className)}>
            Create account
          </Text>
          <CardBase className="w-full">
            {step === 'user_info' && (
              <UserForm goToNextStep={() => setStep('code')} />
            )}
            {step === 'code' && <CodeForm onDone={handleOnDone} />}
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
  const form = useForm<TUserForm>({});

  const submit = form.handleSubmit(async data => {
    const signUpAttempt = await signUp?.create({
      emailAddress: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
    });
    await signUpAttempt?.prepareEmailAddressVerification({
      strategy: 'email_code',
    });
    goToNextStep();
  });

  useEffect(() => {
    form.setFocus('firstName');
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
  const form = useForm<TCodeForm>({});

  const submit = form.handleSubmit(async data => {
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
  });

  useEffect(() => {
    form.setFocus('code');
  }, []);

  return (
    <form onSubmit={submit}>
      <div className="flex flex-col gap-4">
        <Input
          type="number"
          label="Code"
          {...form.register('code', {
            required: {
              value: true,
              message: 'Code is required',
            },
            maxLength: 6,
            minLength: 6,
          })}
          error={form.formState.errors.code}
          onPaste={async () => await form.trigger('code')}
        />

        <Button type="submit" isLoading={form.formState.isSubmitting}>
          Submit
        </Button>
      </div>
    </form>
  );
}
