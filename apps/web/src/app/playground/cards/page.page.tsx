import {Event, User} from '@prisma/client';
import {
  InfoCard,
  EventCard,
  DateCard,
  LocationCard,
  OrganizerCard,
  UrlCard,
} from 'cards';
import {CardBase, Container, InfoIconWithTooltip} from 'ui';
import {getBaseUrl} from 'utils';

function Section({children}: {children?: React.ReactNode}) {
  return <div className="flex flex-col gap-4">{children}</div>;
}

const event: Event & {user: User} = {
  id: '1',
  title: 'Exploring the Frontiers of Space: A Journey Through the Cosmos',
  description:
    'Exploring the Frontiers of Space: A Journey Through the Cosmos" is a one-of-a-kind event that will take you on an exhilarating journey through the vast expanse of the universe. Join us for an immersive experience as we explore the latest discoveries and cutting-edge technologies that are pushing the boundaries of space exploration.',
  featuredImageSrc: 'https://via.placeholder.com/150',
  featuredImageHeight: 150,
  featuredImageWidth: 150,
  featuredImagePreviewSrc: 'https://via.placeholder.com/150',
  endDate: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
  address: 'Hello',
  isPublished: true,
  latitude: 1.312312,
  longitude: 1.231231,
  maxNumberOfAttendees: 0,
  startDate: new Date(),
  messageId: '1',
  organizationId: null,
  shortId: '123',
  userId: '1',
  preferredCurrency: 'USD',
  user: {
    id: '1',
    firstName: 'Ilya',
    lastName: 'Daraseliya',
    email: 'example@example.com',
    profileImageSrc: 'https://via.placeholder.com/150',
    createdAt: new Date(),
    updatedAt: new Date(),
    disabled: false,
    type: 'USER',
    externalId: '1',
    organizationId: null,
    stripeCustomerId: null,
    subscriptionId: null,
    stripeLinkedAccountId: null,
    preferredCurrency: 'USD',
  },
};

export default function CardsPage() {
  return (
    <Container maxSize="sm" className="flex flex-col gap-4">
      <Section>
        <CardBase
          badges={[
            {
              badgeColor: 'green',
              badgeContent: (
                <div className="flex gap-[2px]">
                  <span className="text-xs uppercase font-bold">Published</span>{' '}
                  <InfoIconWithTooltip text="Some text" />
                </div>
              ),
            },
          ]}
        >
          This is some base card
        </CardBase>
      </Section>
      <Section>
        <InfoCard event={event} />
      </Section>
      <Section>
        <EventCard event={event} />
      </Section>
      <Section>
        <DateCard
          onAddToCalendarClick={async () => {
            'use server';
          }}
          startDate={event.startDate}
          endDate={event.endDate}
        />
      </Section>
      <Section>
        <LocationCard
          address={event.address}
          latitude={event.latitude!}
          longitude={event.longitude!}
          onGetDirectionsClick={async () => {
            'use server';
          }}
        />
      </Section>
      <Section>
        <UrlCard
          isPublished={event.isPublished}
          url={`${getBaseUrl()}/e/${event.shortId}`}
          publicEventUrl={`${getBaseUrl()}/e/${event.shortId}`}
        />
      </Section>
      <Section>
        <OrganizerCard
          name={`${event.user.firstName} ${event.user.lastName}`}
          profileImageSrc={event.user.profileImageSrc}
          profilePath={`/u/${event.user.id}`}
        />
      </Section>
    </Container>
  );
}
