import {api} from '../../../apps/web/src/trpc/react-query-client';

export function useMe() {
  const {data} = api.user.me.useQuery();

  return data;
}
