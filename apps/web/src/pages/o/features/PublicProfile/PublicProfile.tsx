import {Event} from '@prisma/client';
import {EventCard} from 'cards';
import Link from 'next/link';
import {Avatar, CardBase, Container, LoadingBlock, PageHeader, Text} from 'ui';

interface Props {
  isLoadingEvents?: boolean;
  profileImageSrc?: string | null;
  events: Event[];
  name: string;
}

export function PublicProfile({
  isLoadingEvents,
  events,
  name,
  profileImageSrc,
}: Props) {
  return (
    <>
      <Container maxSize="sm" className="flex flex-col gap-y-4">
        <CardBase>
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <Avatar
              className="shrink-0 h-40 w-40"
              imageClassName="rounded-3xl"
              src={profileImageSrc}
              alt={`avatar`}
              height={1000}
              width={1000}
            />
            <div className="flex max-w-full overflow-hidden">
              <Text
                className="text-3xl font-bold truncate"
                data-testid="user-profile-name"
              >
                {name}
              </Text>
            </div>
          </div>
        </CardBase>
        {isLoadingEvents && <LoadingBlock />}
        {events && (
          <div>
            <PageHeader title="My events" />
          </div>
        )}
        {events && events?.length > 0 && (
          <div className="flex flex-col gap-4">
            {events.map(event => {
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
        )}
        {!isLoadingEvents && events?.length === 0 && (
          <div className="flex justify-center p-4">
            <Text>No events yet...</Text>
          </div>
        )}
      </Container>
    </>
  );
}
