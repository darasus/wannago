import Link from 'next/link';
import {api} from '../../../../apps/web/src/trpc/server-http';
import {Text} from 'ui';
import {EventCard} from '../EventCard/EventCard';

export async function PublicEvents() {
  const events = await api.event.getPublicEvents.query();

  if (!events || events.length === 0) {
    return (
      <div className="flex justify-center p-4">
        <Text>No events yet...</Text>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {events.map((event) => {
        return (
          <Link
            href={`/e/${event.shortId}`}
            key={event.id}
            data-testid="event-card"
          >
            <EventCard event={event} />
          </Link>
        );
      })}
    </div>
  );
}
