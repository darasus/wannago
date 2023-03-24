import {toast} from 'react-hot-toast';
import {trpc} from 'trpc/src/trpc';
import {useMyOrganizationMembersQuery} from './useMyOrganizationMembersQuery';
import {useMyOrganizationQuery} from './useMyOrganizationQuery';

export function useCreateOrganizationMutation() {
  const myOrganization = useMyOrganizationQuery();
  const myOrganizationMember = useMyOrganizationMembersQuery();

  return trpc.organization.create.useMutation({
    onSuccess: () => {
      toast.success('Organization is successfully created!');
    },
    onError: err => {
      toast.error(err.message);
    },
    onSettled: () => {
      myOrganization.refetch();
      myOrganizationMember.refetch();
    },
  });
}
