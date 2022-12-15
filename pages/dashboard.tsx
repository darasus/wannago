import Link from 'next/link';
import {PlusCircleIcon} from '@heroicons/react/24/outline';
import {useRouter} from 'next/router';
import AppLayout from '../components/AppLayout/AppLayout';
import {trpc} from '../utils/trpc';
import {Spinner} from '../components/Spinner/Spinner';
import {EventCard} from '../components/Card/EventCard/EventCard';
import Head from 'next/head';
import {Container} from '../components/Container/Container';
import {LoadingEventCard} from '../components/Card/LoadingEventCard/LoadingEventCard';
import clsx from 'clsx';

export default function HomePage() {
  const router = useRouter();
  const {data, isLoading} = trpc.me.getMyEvents.useQuery();

  return (
    <>
      <Head>
        <title>Dashboard | WannaGo</title>
      </Head>
      <AppLayout>
        <Container className="md:px-4">
          <button
            onClick={() => router.push('/event/add')}
            className={clsx(
              'flex justify-center items-center w-full h-full p-4 mb-4',
              'border-dashed border-2 rounded-xl',
              'bg-gray-200 hover:bg-gray-300 ',
              'border-gray-400 hover:border-gray-500',
              'text-gray-400 hover:text-gray-500'
            )}
          >
            <PlusCircleIcon width={30} height={30} />
          </button>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {isLoading &&
              Array.from({length: 3}).map((_, i) => (
                <LoadingEventCard key={i} />
              ))}
            {data?.events?.map(event => {
              return (
                <Link href={`/event/${event.id}`} key={event.id}>
                  <EventCard event={event} />
                </Link>
              );
            })}
          </div>
        </Container>
      </AppLayout>
    </>
  );
}
