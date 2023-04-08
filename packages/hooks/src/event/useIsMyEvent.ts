import {trpc} from 'trpc/src/trpc';

export function useIsMyEvent({eventShortId}: {eventShortId: string | null}) {
  return trpc.event.getIsMyEvent.useQuery(
    {eventShortId: eventShortId!},
    {enabled: !!eventShortId}
  );
}
