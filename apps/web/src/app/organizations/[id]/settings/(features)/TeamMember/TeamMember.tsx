import {Organization, User} from '@prisma/client';
import {useConfirmDialog} from 'hooks';
import {useCallback, useTransition} from 'react';
import {Badge, Button, Text} from 'ui';
import {removeMember} from './actions';
import {toast} from 'react-hot-toast';

interface Props {
  member: User;
  organization: Organization;
}

export function TeamMember({member, organization}: Props) {
  const [isPending, startTransition] = useTransition();

  const handleRemove = useCallback(async () => {
    startTransition(async () => {
      if (organization.id) {
        await removeMember({
          userId: member.id,
          organizationId: organization.id,
        }).catch((error) => {
          toast.error(error.message);
        });
      }
    });
  }, [member, organization?.id]);

  const {modal, open} = useConfirmDialog({
    title: 'Are you sure you want to remove team member?',
    description: `This team member will no longer be able to access you team's events`,
    onConfirm: async () => {
      await handleRemove();
    },
  });

  return (
    <>
      {modal}
      <div className="flex gap-2 items-center">
        <Text className="text-sm">{`${member.firstName} ${member.lastName}`}</Text>
        <Badge>Admin</Badge>
        <Button
          variant="destructive"
          size="sm"
          onClick={open}
          disabled={isPending}
          isLoading={isPending}
        >
          Remove
        </Button>
      </div>
    </>
  );
}
