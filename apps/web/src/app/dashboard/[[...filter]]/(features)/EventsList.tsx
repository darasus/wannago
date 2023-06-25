import {Event} from '@prisma/client';
import {EventCard} from 'cards';
import Link from 'next/link';
import {use} from 'react';

interface Props {
  events: Promise<Event[]>;
  eventType: any;
}

export function EventsList({events, eventType}: Props) {
  const data = use(events);

  return (
    <div className="flex flex-col gap-y-4">
      {data.length === 0 && (
        <div className="text-center">
          <span className="text-5xl">🤷</span>
          <div />
          <span className="text-lg font-medium">
            {
              'It looks empty here, start by clicking on "+" button to create your first event.'
            }
          </span>
        </div>
      )}
      {data?.map(event => {
        return (
          <Link
            href={`/e/${event.shortId}`}
            key={event.id}
            data-testid="event-card"
          >
            <EventCard
              event={event}
              showPublishStatus={eventType === 'organizing'}
            />
          </Link>
        );
      })}
    </div>
  );
}
