import {Event} from '@prisma/client';
import {getBaseUrl} from 'utils';
import {DateCard} from '../DateCard/DateCard';
import {EventUrlCard} from '../EventUrlCard/EventUrlCard';
import {InfoCard} from 'cards';
import {LocationCard} from '../LocationCard/LocationCard';
import {OrganizerCard} from '../OrganizerCard/OrganizerCard';
import {StreamCard} from '../StreamCard/StreamCard';
import {SignUpCard} from '../SignUpCard/SignUpCard';

interface Props {
  event: Event;
}

export function EventView({event}: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="items-stretch">
          <OrganizerCard event={event} />
        </div>
        <div className="items-stretch">
          <EventUrlCard
            url={`${getBaseUrl()}/e/${event.shortId}`}
            eventId={event.id}
            isPublished={event.isPublished ?? false}
          />
        </div>
      </div>
      <div>
        <InfoCard event={event} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="items-stretch">
          {event.address && (
            <LocationCard
              address={event.address}
              longitude={event.longitude!}
              latitude={event.latitude!}
              eventId={event.id}
            />
          )}
          {event.streamUrl && (
            <StreamCard eventId={event.id} streamUrl={event.streamUrl} />
          )}
        </div>
        <div className="items-stretch">
          <DateCard event={event} />
        </div>
      </div>
      <SignUpCard event={event} />
    </div>
  );
}
