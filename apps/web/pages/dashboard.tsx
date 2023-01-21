import Link from 'next/link';
import {PlusCircleIcon} from '@heroicons/react/24/outline';
import {useRouter} from 'next/router';
import AppLayout from '../components/AppLayout/AppLayout';
import {trpc} from '../utils/trpc';
import {EventCard} from '../components/EventCard/EventCard';
import Head from 'next/head';
import {Container} from '../components/Container/Container';
import {LoadingEventCard} from '../components/LoadingEventCard/LoadingEventCard';
import {Button} from '../components/Button/Button';
import {withProtected} from '../utils/withAuthProtect';
import {cn} from '../utils/cn';

function Dashboard() {
  const router = useRouter();
  const {data, isLoading} = trpc.me.getMyEvents.useQuery();
  const haveNoEvents = data?.length === 0;

  return (
    <>
      <Head>
        <title>Dashboard | WannaGo</title>
      </Head>
      <AppLayout>
        <Container className="md:px-4">
          <Button
            onClick={() => router.push('/event/add')}
            className={cn(
              'flex justify-center items-center w-full h-full p-4 mb-4'
            )}
            iconLeft={<PlusCircleIcon />}
            data-testid="add-event-button"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {isLoading &&
              Array.from({length: 3}).map((_, i) => (
                <LoadingEventCard key={i} />
              ))}
            {data?.map(event => {
              return (
                <Link
                  href={`/event/${event.id}`}
                  key={event.id}
                  data-testid="event-card"
                >
                  <EventCard event={event} />
                </Link>
              );
            })}
          </div>
          {haveNoEvents && (
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
      </AppLayout>
    </>
  );
}

export default withProtected(Dashboard);
