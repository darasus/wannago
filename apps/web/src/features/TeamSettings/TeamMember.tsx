import {OrganizationMembershipResource} from '@clerk/types';
import {useCallback} from 'react';
import {toast} from 'react-hot-toast';
import {Badge, Button, Text} from 'ui';

interface Props {
  member: OrganizationMembershipResource;
}

export function TeamMember({member}: Props) {
  const handleRemove = useCallback(async () => {
    try {
      await member.destroy();
    } catch (error: any) {
      if (error.errors?.length > 0) {
        error.errors?.forEach((e: any) => {
          toast.error(e?.longMessage || 'Something went wrong');
        });
      } else {
        toast.error('Something went wrong');
      }
    }
  }, [member]);

  return (
    <div className="flex gap-2 items-center">
      <Text className="text-sm">{`${member.publicUserData.firstName} ${member.publicUserData.lastName}`}</Text>
      <Badge size="xs">{member.role}</Badge>
      <Button variant="danger" size="xs" onClick={handleRemove}>
        Remove
      </Button>
    </div>
  );
}
