import {trpc} from 'trpc/src/trpc';

export function useGetCurrencyQuery() {
  return trpc.payments.getCurrency.useQuery(undefined, {initialData: 'USD'});
}
