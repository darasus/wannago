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
} from 'ui';
import Link from 'next/link';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {api} from '../../../../apps/web/src/trpc/client';
import {useRouter} from 'next/navigation';
import {toast} from 'sonner';

interface Props {
  token: string;
}

const formSchema = z.object({
  token: z.string(),
  newPassword: z.string().min(6).max(255),
  repeatNewPassword: z.string().min(6).max(255),
});

export function NewPasswordForm({token}: Props) {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      token,
    },
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    await api.auth.resetPassword
      .mutate(data)
      .then((res) => {
        if (res?.success) {
          toast.success('Password is updated!');
          router.refresh();
          router.push('/sign-in');
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>New password</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <FormField
                control={form.control}
                name="newPassword"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>New password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={form.formState.isSubmitting}
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="repeatNewPassword"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Repeat new password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={form.formState.isSubmitting}
                        type="password"
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
                Submit new password
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
