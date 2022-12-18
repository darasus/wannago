import Link from 'next/link';
import {PlusCircleIcon} from '@heroicons/react/24/outline';
import {useRouter} from 'next/router';
import AppLayout from '../components/AppLayout/AppLayout';
import {trpc} from '../utils/trpc';
import {EventCard} from '../components/Card/EventCard/EventCard';
import Head from 'next/head';
import {Container} from '../components/Container/Container';
import {LoadingEventCard} from '../components/Card/LoadingEventCard/LoadingEventCard';
import clsx from 'clsx';
import {GetServerSidePropsContext} from 'next';
import {buildClerkProps, clerkClient, getAuth} from '@clerk/nextjs/server';

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
              'bg-gray-50 hover:bg-gray-100 ',
              'border-gray-700 hover:border-gray-800',
              'text-gray-700 hover:text-gray-800'
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

export async function getServerSideProps({
  req,
  res,
}: GetServerSidePropsContext) {
  const {userId} = getAuth(req);
  const user = userId ? await clerkClient.users.getUser(userId) : null;

  const ONE_WEEK_IN_SECONDS = 60 * 60 * 24 * 7;
  res.setHeader(
    'Cache-Control',
    `s-maxage=60, stale-while-revalidate=${ONE_WEEK_IN_SECONDS}`
  );

  return {props: {...buildClerkProps(req, {user})}};
}
