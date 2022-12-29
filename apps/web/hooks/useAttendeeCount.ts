import {trpc} from '../utils/trpc';

export function useAttendeeCount({
  eventId,
  fake,
}: {
  eventId: string | undefined;
  fake?: boolean;
}) {
  return trpc.event.getNumberOfAttendees.useQuery(
    {
      eventId: eventId!,
    },
    {
      enabled: !!eventId && !fake,
    }
  );
}
