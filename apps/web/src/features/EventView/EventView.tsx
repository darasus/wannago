import {Event, Organization, User} from '@prisma/client';
import {getBaseUrl} from 'utils';
import {DateCard} from '../DateCard/DateCard';
import {EventUrlCard} from '../EventUrlCard/EventUrlCard';
import {InfoCard} from 'cards';
import {LocationCard} from '../LocationCard/LocationCard';
import {OrganizerCard} from '../OrganizerCard/OrganizerCard';
import {SignUpCard} from '../SignUpCard/SignUpCard';

interface Props {
  event: Event & {
    user: User | null;
    organization: Organization | null;
  };
  isLoadingImage?: boolean;
  isMyEvent?: boolean;
}

export function EventView({event, isLoadingImage, isMyEvent}: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div className="sticky top-4 z-20">
        <SignUpCard event={event} />
      </div>
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
        <InfoCard
          event={event}
          isLoadingImage={isLoadingImage}
          isMyEvent={isMyEvent}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="items-stretch">
          <LocationCard
            address={event.address}
            longitude={event.longitude!}
            latitude={event.latitude!}
            eventId={event.id}
          />
        </div>
        <div className="items-stretch">
          <DateCard event={event} />
        </div>
      </div>
    </div>
  );
}
