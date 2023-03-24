import {toast} from 'react-hot-toast';
import {trpc} from 'trpc/src/trpc';
import {useMyOrganizationMembersQuery} from './useMyOrganizationMembersQuery';
import {useMyOrganizationQuery} from './useMyOrganizationQuery';

export function useRemoveOrganizationMutation() {
  const myOrganization = useMyOrganizationQuery();
  const myOrganizationMembers = useMyOrganizationMembersQuery();

  return trpc.organization.remove.useMutation({
    onSuccess: () => {
      toast.success('Organization is successfully removed!');
    },
    onError: err => {
      toast.error(err.message);
    },
    onSettled: () => {
      myOrganization.refetch();
      myOrganizationMembers.refetch();
    },
  });
}
