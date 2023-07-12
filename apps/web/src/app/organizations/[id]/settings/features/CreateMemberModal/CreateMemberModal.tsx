'use client';

import {captureException} from '@sentry/nextjs';
import {useForm} from 'react-hook-form';
import {
  Button,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Modal,
} from 'ui';
import {Organization} from '@prisma/client';
import {addMember} from './actions';
import {toast} from 'react-hot-toast';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';

interface Props {
  isOpen: boolean;
  organization: Organization;
  onClose: () => void;
}

const formScheme = z.object({
  email: z.string().email(),
});

export function CreateMemberModal({isOpen, onClose, organization}: Props) {
  const form = useForm({
    resolver: zodResolver(formScheme),
    defaultValues: {
      email: '',
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    await addMember({
      email: data.email,
      organizationId: organization.id,
    })
      .then(() => {
        onClose();
      })
      .catch((error: any) => {
        captureException(error);
        toast.error(error.message);
      });
  });

  return (
    <Modal title="Add member" isOpen={isOpen} onClose={onClose}>
      <Form {...form}>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <FormField
              name="email"
              control={form.control}
              render={({field}) => (
                <FormItem>
                  <FormLabel>Member email</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Type email here..." />
                  </FormControl>
                  <FormDescription>
                    Member account must be created first before adding to the
                    organization
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              isLoading={form.formState.isSubmitting}
            >
              Add
            </Button>
          </div>
        </form>
      </Form>
    </Modal>
  );
}
