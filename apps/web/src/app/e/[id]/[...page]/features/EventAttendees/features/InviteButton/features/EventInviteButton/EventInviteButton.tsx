'use client';

import {useForm} from 'react-hook-form';
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from 'ui';
import {toast} from 'react-hot-toast';
import {useParams, useRouter} from 'next/navigation';
import {z} from 'zod';
import {inviteByEmail} from './actions';

const formScheme = z.object({
  firstName: z.string().nonempty(),
  lastName: z.string().nonempty(),
  email: z.string().email(),
});

export function EventInviteButton() {
  const params = useParams();
  const eventShortId = params?.id as string;
  const router = useRouter();

  const form = useForm<z.infer<typeof formScheme>>();

  const onSubmit = form.handleSubmit(async (data) => {
    if (eventShortId) {
      await inviteByEmail({...data, eventShortId})
        .then(() => {
          toast.success('Invitation sent!');
          form.reset();
          router.refresh();
        })
        .catch((error) => {
          toast.error(
            typeof error.message === 'string'
              ? error.message
              : 'Something went wrong'
          );
        });
    }
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" data-testid="invite-by-email-open-modal-button">
          Invite by email
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite by email</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <div className="grid grid-cols-12 gap-4 grow mb-4">
              <div className="col-span-6">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>First name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          data-testid="invite-by-email-first-name-input"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-6">
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Last name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          data-testid="invite-by-email-last-name-input"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-12">
                <FormField
                  control={form.control}
                  name="email"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          data-testid="invite-by-email-email-input"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                isLoading={form.formState.isSubmitting}
                className="w-full"
                data-testid="invite-by-email-submit-button"
              >
                Invite
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}