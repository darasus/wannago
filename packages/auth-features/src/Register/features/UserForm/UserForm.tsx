import {useSignUp} from '@clerk/nextjs';
import {useFormContext} from 'react-hook-form';
import {z} from 'zod';
import {APIResponseError, infoFormScheme, parseError} from '../../../shared';
import {useEffect} from 'react';
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from 'ui';

interface UserFormProps {
  goToNextStep: () => void;
}

export function UserForm({goToNextStep}: UserFormProps) {
  const {signUp} = useSignUp();
  const form = useFormContext<z.infer<typeof infoFormScheme>>();

  const submit = form.handleSubmit(async (data) => {
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
    <Form {...form}>
      <form onSubmit={submit}>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({field}) => (
                <FormItem>
                  <FormLabel>First name</FormLabel>
                  <FormControl>
                    <Input {...field} data-testid="register-first-name-input" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Last name</FormLabel>
                  <FormControl>
                    <Input {...field} data-testid="register-last-name-input" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="email"
            render={({field}) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    autoComplete="email"
                    data-testid="register-email-input"
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
            data-testid="register-user-info-form-submit"
          >
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}
