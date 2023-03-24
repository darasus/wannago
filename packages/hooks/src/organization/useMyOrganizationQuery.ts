import {trpc} from 'trpc/src/trpc';

export function useMyOrganizationQuery() {
  return trpc.organization.getMyOrganization.useQuery(undefined, {
    retry(_, error) {
      if (
        error.data?.code === 'NOT_FOUND' ||
        error.data?.code === 'UNAUTHORIZED'
      ) {
        return false;
      }
      return true;
    },
  });
}
