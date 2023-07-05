'use client';

import {useSignIn} from '@clerk/nextjs';
import {useEffect} from 'react';
import {useFormContext} from 'react-hook-form';
import {
  Button,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  Input,
  FormMessage,
  FormDescription,
} from 'ui';
import {z} from 'zod';
import {APIResponseError, codeFormScheme} from '../../../shared';

interface CodeFormProps {
  email: string;
  onDone: (createdSessionId: string) => Promise<void>;
}

export function CodeForm({onDone, email}: CodeFormProps) {
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
