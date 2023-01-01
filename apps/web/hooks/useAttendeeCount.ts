import {trpc} from '../utils/trpc';

export function useAttendeeCount({eventId}: {eventId: string | undefined}) {
  return trpc.event.getNumberOfAttendees.useQuery(
    {
      eventId: eventId!,
    },
    {
      enabled: !!eventId,
    }
  );
}
