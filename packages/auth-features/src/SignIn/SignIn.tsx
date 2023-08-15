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
import {ContinueWithGoogleButton} from '../ContinueWithGoogleButton/ContinueWithGoogleButton';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {api} from '../../../../apps/web/src/trpc/client';
import {useRouter} from 'next/navigation';

interface Props {}

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export function SignIn({}: Props) {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    await api.auth.signIn.mutate(data).then((res) => {
      if (res?.success) {
        router.refresh();
        router.push('/dashboard');
      }
    });
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>
            Sign in with email and password or using your Google account
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
              <FormField
                control={form.control}
                name="password"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
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
                Login
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
      <ContinueWithGoogleButton />
      <div>
        <span className="text-sm text-muted-foreground">
          {`If you don't have account, please`}{' '}
          <Link className="underline" href="/sign-up">
            sing up
          </Link>{' '}
          {`first.`}
        </span>
      </div>
    </div>
  );
}
