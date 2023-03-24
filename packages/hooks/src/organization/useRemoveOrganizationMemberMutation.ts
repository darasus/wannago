import {toast} from 'react-hot-toast';
import {trpc} from 'trpc/src/trpc';
import {useMyOrganizationMembersQuery} from './useMyOrganizationMembersQuery';

export function useRemoveOrganizationMemberMutation() {
  const myOrganizationMembers = useMyOrganizationMembersQuery();

  return trpc.organization.removeOrganizationMember.useMutation({
    onSuccess: () => {
      toast.success('Member is successfully removed!');
    },
    onError: err => {
      toast.error(err.message);
    },
    onSettled: () => myOrganizationMembers.refetch(),
  });
}
