'use client';

import {useState} from 'react';
import {useForm} from 'react-hook-form';
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Modal,
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
  const [on, set] = useState(false);
  const params = useParams();
  const eventShortId = params?.id as string;
  const router = useRouter();

  const form = useForm<z.infer<typeof formScheme>>();
  const {
    handleSubmit,
    reset,
    formState: {isSubmitting},
  } = form;

  const onSubmit = handleSubmit(async (data) => {
    if (eventShortId) {
      await inviteByEmail({...data, eventShortId})
        .then((res) => {
          console.log('>>> res', res);
          toast.success('Invitation sent!');
          reset();
          router.refresh();
          set(false);
        })
        .catch((error) => {
          toast.error(error.message);
        });
    }
  });

  return (
    <>
      <Modal title="Invite by email" isOpen={on} onClose={() => set(false)}>
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <div className="grid grid-cols-12 gap-2 grow mr-2">
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
              <div className="col-span-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  isLoading={isSubmitting}
                  className="w-full"
                  data-testid="invite-by-email-submit-button"
                >
                  Invite
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </Modal>
      <Button
        size="sm"
        onClick={() => set(true)}
        data-testid="invite-by-email-open-modal-button"
      >
        Invite by email
      </Button>
    </>
  );
}
