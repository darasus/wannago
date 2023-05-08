import {User} from '@prisma/client';
import {
  useConfirmDialog,
  useMyOrganizationQuery,
  useRemoveOrganizationMemberMutation,
} from 'hooks';
import {useCallback} from 'react';
import {Badge, Button, Text} from 'ui';

interface Props {
  member: User;
}

export function TeamMember({member}: Props) {
  const organization = useMyOrganizationQuery();
  const removeOrganizationMember = useRemoveOrganizationMemberMutation();
  const handleRemove = useCallback(async () => {
    if (organization.data?.id) {
      removeOrganizationMember.mutate({
        userId: member.id,
        organizationId: organization.data.id,
      });
    }
  }, [member, removeOrganizationMember, organization.data?.id]);
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
        <Badge size="xs">Admin</Badge>
        <Button
          variant="danger"
          size="xs"
          onClick={open}
          disabled={removeOrganizationMember.isLoading}
          isLoading={removeOrganizationMember.isLoading}
        >
          Remove
        </Button>
      </div>
    </>
  );
}
