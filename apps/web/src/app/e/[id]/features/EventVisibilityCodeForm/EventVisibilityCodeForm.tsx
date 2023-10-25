'use client';

import {zodResolver} from '@hookform/resolvers/zod';
import {useRouter} from 'next/navigation';
import {useForm} from 'react-hook-form';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Container,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from 'ui';
import {z} from 'zod';
import {api} from '../../../../../trpc/client';

interface Props {
  id: string;
}

export function EventVisibilityCodeForm({id}: Props) {
  const router = useRouter();
  const formSchema = z.object({
    code: z
      .string()
      .min(1)
      .refine(async (val) => {
        const result = await api.event.validateEventVisibilityCode.query({
          code: val,
          id,
        });

        return result;
      }, 'Code you provided is not valid'),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      code: '',
    },
    resolver: zodResolver(formSchema),
  });

  const handleSubmit = form.handleSubmit((data) => {
    router.push(`/e/${id}?code=${data.code}`);
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit}>
        <Container className="flex flex-col gap-4" maxSize="xs">
          <Card>
            <CardHeader>
              <CardTitle>Event is protected with code</CardTitle>
              <CardDescription>
                If you received the sign up code from organizer please enter it
                here.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="code"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Code</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter the code"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button className="w-full">Submit</Button>
            </CardFooter>
          </Card>
        </Container>
      </form>
    </Form>
  );
}
