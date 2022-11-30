import Image from 'next/image';
import Link from 'next/link';
import {Card} from '../components/Card/Card';
import {Text} from '../components/Text/Text';
import {PlusCircleIcon} from '@heroicons/react/24/solid';
import {useRouter} from 'next/router';
import AppLayout from '../components/AppLayout/AppLayout';
import {trpc} from '../utils/trpc';
import {Spinner} from '../components/Spinner/Spinner';
import {EventCard} from '../components/EventCard/EventCard';

export default function HomePage() {
  const router = useRouter();
  const {data, isLoading} = trpc.event.getMyEvents.useQuery();

  return (
    <AppLayout>
      <div className="grid grid-cols-1 gap-4">
        <button
          onClick={() => router.push('/event/add')}
          className="flex justify-center items-center w-full h-24 p-4 bg-gray-200 hover:bg-gray-300 border-gray-400 hover:border-gray-600 border-dashed border-2 rounded-xl text-gray-400 hover:text-gray-600"
        >
          <PlusCircleIcon width={50} height={50} />
        </button>
        {isLoading && (
          <div className="flex justify-center">
            <Spinner />
          </div>
        )}
        {data?.events?.map(event => {
          return (
            <Link href={`/event/${event.id}`} key={event.id}>
              <EventCard event={event} />
            </Link>
          );
        })}
      </div>
    </AppLayout>
  );
}
