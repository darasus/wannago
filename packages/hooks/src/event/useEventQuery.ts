import {trpc} from 'trpc/src/trpc';

export function useEventQuery({eventShortId}: {eventShortId: string | null}) {
  return trpc.event.getByShortId.useQuery(
    {
      id: eventShortId!,
    },
    {enabled: !!eventShortId}
  );
}
