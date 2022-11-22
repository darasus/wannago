import {Event} from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';
import {NextRequest} from 'next/server';
import {Card} from '../components/Card/Card';
import {Text} from '../components/Text/Text';
import {api} from '../lib/api';
import {PlusCircleIcon} from '@heroicons/react/24/solid';
import {useRouter} from 'next/router';
import AppLayout from '../components/AppLayout/AppLayout';

interface Props {
  events: Event[];
}

export default function HomePage({events}: Props) {
  const router = useRouter();

  return (
    <AppLayout>
      <div className="grid grid-cols-3 gap-4">
        <button
          onClick={() => router.push('/event/add')}
          className="flex justify-center items-center w-full p-4 bg-gray-200 hover:bg-gray-300 border-gray-400 hover:border-gray-600 border-dashed border-2 rounded-xl aspect-square text-gray-400 hover:text-gray-600"
        >
          <PlusCircleIcon width={50} height={50} />
        </button>
        {events?.map(event => {
          return (
            <Link href={`/event/${event.id}`} key={event.id}>
              <Card className="flex flex-col p-0 aspect-square">
                <div className="grow overflow-hidden relative justify-center bg-black rounded-t-xl">
                  <Image
                    src="https://source.unsplash.com/GNwiKB34eGs"
                    alt=""
                    fill
                    style={{objectFit: 'cover'}}
                    priority
                  />
                </div>
                <div className="p-4">
                  <Text className="text-lg font-bold">{event.title}</Text>
                  <div />
                  <p className="truncate text-md">{event.description}</p>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </AppLayout>
  );
}

export async function getServerSideProps({req}: {req: NextRequest}) {
  const requestHeaders = new Headers(req.headers);
  const userId = requestHeaders.get('x-user-id');

  if (!userId) {
    return {props: {}};
  }

  const events = await api.getMyEvents(userId);

  return {props: {events}};
}
