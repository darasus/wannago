import {useSignUp} from '@clerk/nextjs';
import {useFormContext} from 'react-hook-form';
import {z} from 'zod';
import {APIResponseError, codeFormScheme, parseError} from '../../../shared';
import {useEffect} from 'react';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  Input,
  FormDescription,
  FormMessage,
  Button,
} from 'ui';

interface CodeFormProps {
  email: string;
  onDone: (createdSessionId: string) => Promise<void>;
}

export function CodeForm({onDone, email}: CodeFormProps) {
  const {signUp} = useSignUp();
  const form = useFormContext<z.infer<typeof codeFormScheme>>();
  const code = form.watch('code');

  const submit = form.handleSubmit(async (data) => {
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
                    autoComplete="off"
                    data-testid="register-code-input"
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
            data-testid="register-code-form-submit"
          >
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}
