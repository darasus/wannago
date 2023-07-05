import {useSignIn} from '@clerk/nextjs';
import {useEffect} from 'react';
import {useFormContext} from 'react-hook-form';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  Input,
  FormMessage,
  Button,
} from 'ui';
import {z} from 'zod';
import {emailFormScheme, APIResponseError} from '../../../shared';
import {parseError} from '../CodeForm/CodeForm';

interface EmailFormProps {
  goToNextStep: () => void;
}

export function EmailForm({goToNextStep}: EmailFormProps) {
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
