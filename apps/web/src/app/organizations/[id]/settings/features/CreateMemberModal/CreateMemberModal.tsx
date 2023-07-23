'use client';

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
import {toast} from 'react-hot-toast';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {api} from '../../../../../../trpc/client';
import {useRouter} from 'next/navigation';

interface Props {
  isOpen: boolean;
  organization: Organization;
  onClose: () => void;
}

const formScheme = z.object({
  email: z.string().email(),
});

export function CreateMemberModal({isOpen, onClose, organization}: Props) {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(formScheme),
    defaultValues: {
      email: '',
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    await api.organization.addOrganizationMember
      .mutate({
        userEmail: data.email,
        organizationId: organization.id,
      })
      .then(() => {
        router.refresh();
        form.reset();
        onClose();
      })
      .catch((error: any) => {
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
