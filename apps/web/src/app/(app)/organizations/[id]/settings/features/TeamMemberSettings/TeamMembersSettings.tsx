'use client';

import {use, useState} from 'react';
import {
  Button,
  CardBase,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from 'ui';
import {TeamMember} from '../TeamMember/TeamMember';
import {Organization} from '@prisma/client';
import {RouterOutputs} from 'api';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {api} from '../../../../../../../trpc/client';
import {useRouter} from 'next/navigation';
import {toast} from 'sonner';

interface Props {
  organization: Organization;
  membersPromise: Promise<
    RouterOutputs['organization']['getMyOrganizationMembers']
  >;
}

const formScheme = z.object({
  email: z.string().email(),
});

export function TeamMembersSettings({organization, membersPromise}: Props) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const members = use(membersPromise);

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
        setOpen(false);
      })
      .catch((error: any) => {
        toast.error(error.message);
      });
  });

  return (
    <>
      <div className="flex flex-col gap-4">
        <CardBase
          title={'Organization members'}
          titleChildren={
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  variant="link"
                  onClick={() => setOpen(true)}
                  className="p-0"
                >
                  Add member
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add member</DialogTitle>
                </DialogHeader>
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
                              <Input
                                {...field}
                                placeholder="Type email here..."
                              />
                            </FormControl>
                            <FormDescription>
                              Member account must be created first before adding
                              to the organization
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
              </DialogContent>
            </Dialog>
          }
        >
          <div className="flex flex-col gap-y-2">
            {members.map((member) => {
              return (
                <TeamMember
                  key={member.id}
                  member={member}
                  organization={organization}
                />
              );
            })}
          </div>
        </CardBase>
      </div>
    </>
  );
}
