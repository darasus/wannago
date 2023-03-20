import {
  OrganizationInvitationResource,
  OrganizationMembershipResource,
} from '@clerk/types';
import {useCallback, useState} from 'react';
import {toast} from 'react-hot-toast';
import {Badge, Button, Text} from 'ui';

interface Props {
  member: OrganizationMembershipResource | OrganizationInvitationResource;
}

export function TeamMember({member}: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const handleRemove = useCallback(async () => {
    try {
      setIsLoading(true);
      if ('destroy' in member) {
        await member.destroy();
      }
      if ('revoke' in member) {
        await member.revoke();
      }
    } catch (error: any) {
      if (error.errors?.length > 0) {
        error.errors?.forEach((e: any) => {
          toast.error(e?.longMessage || 'Something went wrong');
        });
      } else {
        toast.error('Something went wrong');
      }
    } finally {
      setIsLoading(false);
    }
  }, [member]);

  const name =
    'publicUserData' in member &&
    `${member.publicUserData.firstName} ${member.publicUserData.lastName}`;
  const email = 'emailAddress' in member && member.emailAddress;
  const status = 'status' in member && member.status;

  return (
    <div className="flex gap-2 items-center">
      <Text className="text-sm">{name || email}</Text>
      <Badge size="xs">{status || member.role}</Badge>
      <Button
        variant="danger"
        size="xs"
        onClick={handleRemove}
        disabled={isLoading}
        isLoading={isLoading}
      >
        Remove
      </Button>
    </div>
  );
}
