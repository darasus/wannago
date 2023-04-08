import Link from 'next/link';
import {EventCard} from 'cards';
import Head from 'next/head';
import {Container, PageHeader, LoadingBlock, Menu} from 'ui';
import {withProtected} from '../../utils/withAuthProtect';
import {useMyEventsQuery} from 'hooks';
import {useRouter} from 'next/router';
import {z} from 'zod';

const filterSchema = z.array(z.enum(['attending', 'organizing', 'all']));

function Dashboard() {
  const router = useRouter();
  const eventType = filterSchema.parse(router.query.filter)[0] || 'all';
  const {data, isLoading, isFetching} = useMyEventsQuery({eventType});
  const haveNoEvents = data?.length === 0;
  const isGettingCards = isLoading || isFetching;

  return (
    <>
      <Head>
        <title>Dashboard | WannaGo</title>
      </Head>
      <Container maxSize="sm" className="flex flex-col gap-y-4 md:px-4">
        <PageHeader title="My events">
          <Menu
            activeHref={router.asPath}
            size="sm"
            options={[
              {
                label: 'All',
                href: '/dashboard/all',
              },
              {
                label: 'Attending',
                href: '/dashboard/attending',
              },
              {
                label: 'Organizing',
                href: '/dashboard/organizing',
              },
            ]}
          />
        </PageHeader>
        {isGettingCards && <LoadingBlock />}
        {!isGettingCards && (
          <div className="flex flex-col gap-y-4">
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
        )}
        {!isGettingCards && haveNoEvents && (
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
      </Container>
    </>
  );
}

export default withProtected(Dashboard);
