import {type RouterOutputs} from 'api';
import {EventCard} from '../EventCard/EventCard';
import Link from 'next/link';
import {Avatar, CardBase, Container, LoadingBlock, PageHeader, Text} from 'ui';
import {notFound} from 'next/navigation';
import {MessageButton} from './features/MessageButton/MessageButton';

interface Props {
  isLoadingEvents?: boolean;
  eventsPromise: Promise<RouterOutputs['event']['getPublicEvents']>;
  userPromise?: Promise<RouterOutputs['user']['getUserById']>;
  organizationPromise?: Promise<
    RouterOutputs['organization']['getOrganizationById']
  >;
}

export async function PublicProfile({
  isLoadingEvents,
  eventsPromise,
  userPromise,
  organizationPromise,
}: Props) {
  const [events, user, organization] = await Promise.all([
    eventsPromise,
    userPromise,
    organizationPromise,
  ]);

  if ((userPromise && !user) || (organizationPromise && !organization)) {
    return notFound();
  }

  const getImageSrc = () => {
    if (user) {
      return user.profileImageSrc;
    }

    if (organization) {
      return organization.logoSrc;
    }
  };

  const getName = () => {
    if (user) {
      return `${user.firstName} ${user.lastName}`;
    }

    if (organization) {
      return organization.name;
    }
  };

  const imageSrc = getImageSrc();
  const name = getName();

  return (
    <>
      <Container maxSize="sm" className="flex flex-col gap-y-4">
        <CardBase innerClassName="flex flex-col gap-2">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <Avatar
              className="shrink-0 h-40 w-40"
              src={imageSrc}
              alt={`avatar`}
              height={700}
              width={700}
            />
            <div className="flex flex-col max-w-full overflow-hidden">
              <Text
                className="text-3xl font-bold truncate"
                data-testid="user-profile-name"
              >
                {name}
              </Text>
              <div className="flex md:justify-start justify-center gap-2 mt-4">
                <MessageButton />
              </div>
            </div>
          </div>
        </CardBase>
        {isLoadingEvents && <LoadingBlock />}
        {events && (
          <div>
            <PageHeader title="Events" />
          </div>
        )}
        {events && events?.length > 0 && (
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
