import {toast} from 'react-hot-toast';
import {trpc} from 'trpc/src/trpc';
import {useMyOrganizationMembersQuery} from './useMyOrganizationMembersQuery';

export function useAddOrganizationMemberMutation() {
  const myOrganizationMembers = useMyOrganizationMembersQuery();

  return trpc.organization.addOrganizationMember.useMutation({
    onError: err => {
      toast.error(err.message);
    },
    onSuccess: () => {
      toast.success('Member is successfully added!');
    },
    onSettled: () => myOrganizationMembers.refetch(),
  });
}
