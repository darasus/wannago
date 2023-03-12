import {Event} from '@prisma/client';
import {getBaseUrl} from 'utils';
import {DateCard} from '../DateCard/DateCard';
import {EventUrlCard} from '../EventUrlCard/EventUrlCard';
import {InfoCard} from 'cards';
import {LocationCard} from '../LocationCard/LocationCard';
import {OrganizerCard} from '../OrganizerCard/OrganizerCard';
import {ParticipantsCard} from '../ParticipantsCard/ParticipantsCard';
import {isPast} from 'utils';
import {StreamCard} from '../StreamCard/StreamCard';
import {SignUpCard} from '../SignUpCard/SignUpCard';
import {Text} from 'ui';

interface Props {
  event: Event;
  timezone?: string;
  isPublic?: boolean;
  relativeTimeString?: string;
}

export function EventView({
  event,
  timezone,
  isPublic,
  relativeTimeString,
}: Props) {
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
          <DateCard
            event={event}
            timezone={timezone}
            relativeTimeString={relativeTimeString}
          />
        </div>
      </div>
      {/* {!isPast(event.endDate, timezone) && (
        <div className="items-stretch">
          <ParticipantsCard event={event} />
        </div>
      )} */}
      {/* <div className="items-stretch"> */}
      <SignUpCard event={event} />
      {/* </div> */}
    </div>
  );
}
