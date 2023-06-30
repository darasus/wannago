import { Event, Organization, Ticket, User } from "@prisma/client";
import {
  DateCard,
  LocationCard,
  OrganizerCard,
  SignUpCard,
  UrlCard,
} from "card-features";
import { InfoCard } from "cards";
import { getBaseUrl } from "utils";

interface Props {
  event: Event & {
    user: User | null;
    organization: Organization | null;
    tickets: Ticket[];
  };
  isLoadingImage?: boolean;
  isMyEvent?: boolean;
  me: User | null;
  myOrganization: Organization | null;
}

export function EventView({
  event,
  isLoadingImage,
  isMyEvent,
  me,
  myOrganization,
}: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div className="sticky top-4 z-20">
        <SignUpCard event={event} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="items-stretch">
          <OrganizerCard
            event={event}
            me={me}
            myOrganization={myOrganization}
          />
        </div>
        <div className="items-stretch">
          <UrlCard
            url={`${getBaseUrl()}/e/${event.shortId}`}
            eventId={event.id}
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
            address={event.address!}
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
