import {Organization, User} from '@prisma/client';
import {useConfirmDialog} from 'hooks';
import {useCallback, useTransition} from 'react';
import {Badge, Button, Text} from 'ui';
import {toast} from 'sonner';
import Link from 'next/link';
import {api} from '../../../../../../../trpc/client';
import {useRouter} from 'next/navigation';

interface Props {
  member: User;
  organization: Organization;
}

export function TeamMember({member, organization}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleRemove = useCallback(async () => {
    startTransition(async () => {
      if (organization.id) {
        await api.organization.removeOrganizationMember
          .mutate({
            userId: member.id,
            organizationId: organization.id,
          })
          .then(() => {
            router.refresh();
            toast.success('Team member removed!');
          })
          .catch((error) => {
            toast.error(error.message);
          });
      }
    });
  }, [member, organization?.id, router]);

  const {modal, open} = useConfirmDialog({
    title: 'Remove team member?',
    description: `This team member will no longer be able to access you team's events`,
    onConfirm: async () => {
      await handleRemove();
    },
  });

  return (
    <>
      {modal}
      <div className="flex gap-2 items-center">
        <Button variant="link" size="sm" className="p-0" asChild>
          <Link href={`/u/${member.id}`}>
            <Text className="text-sm">{`${member.firstName} ${member.lastName}`}</Text>
          </Link>
        </Button>
        <Badge>Admin</Badge>
        <div className="grow" />
        <Button
          variant="link"
          size="sm"
          onClick={open}
          disabled={isPending}
          isLoading={isPending}
          className="text-red-500 p-0"
        >
          Remove
        </Button>
      </div>
    </>
  );
}
