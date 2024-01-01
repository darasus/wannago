'use client';

import {
  Button,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  Input,
  FormMessage,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from 'ui';
import Link from 'next/link';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {api} from '../../../../apps/web/src/trpc/client';
import {useRouter} from 'next/navigation';
import {toast} from 'sonner';

interface Props {}

const formSchema = z.object({
  email: z.string().email(),
});

export function PasswordResetForm({}: Props) {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    await api.auth.sendPasswordResetEmail
      .mutate(data)
      .then((res) => {
        if (res?.success) {
          toast.success('Check your email for a link to reset your password.');
          router.refresh();
          router.push('/sign-in');
        }
      })
      .catch((err) => {
        toast.error(err.message);
        form.setFocus('email');
      });
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Reset password</CardTitle>
          <CardDescription>
            Type your email address and we will send you a link to reset your
            password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <FormField
                control={form.control}
                name="email"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={form.formState.isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                className="w-full"
                isLoading={form.formState.isSubmitting}
                disabled={form.formState.isSubmitting}
              >
                Reset password
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <div className="relative w-full">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-sm uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or</span>
        </div>
      </div>
      <div>
        <span className="text-sm text-muted-foreground">
          {`Go back to`}{' '}
          <Link className="underline" href="/sign-in">
            sign in
          </Link>{' '}
          {`page.`}
        </span>
      </div>
    </div>
  );
}
