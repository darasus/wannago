import {Event} from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';
import {NextRequest} from 'next/server';
import {Card} from '../components/DateCard/Card/Card';
import {Text} from '../components/Text/Text';
import {api} from '../lib/api';
import {PlusCircleIcon} from '@heroicons/react/24/solid';
import {useRouter} from 'next/router';
import AppLayout from '../components/AppLayout/AppLayout';
import {GetServerSidePropsContext} from 'next';
import {getAuth} from '@clerk/nextjs/server';
import {trpc} from '../utils/trpc';

export default function HomePage() {
  const router = useRouter();
  const {data} = trpc.event.getMyEvents.useQuery();

  return (
    <AppLayout>
      <div className="grid grid-cols-1 gap-4">
        <button
          onClick={() => router.push('/event/add')}
          className="flex justify-center items-center w-full h-24 p-4 bg-gray-200 hover:bg-gray-300 border-gray-400 hover:border-gray-600 border-dashed border-2 rounded-xl text-gray-400 hover:text-gray-600"
        >
          <PlusCircleIcon width={50} height={50} />
        </button>
        {data?.events?.map(event => {
          return (
            <Link href={`/event/${event.id}`} key={event.id}>
              <Card className="flex flex-col p-0">
                {event.featuredImageSrc && (
                  <div className="grow overflow-hidden relative justify-center bg-black rounded-t-xl aspect-video">
                    <Image
                      src={event.featuredImageSrc}
                      alt=""
                      fill
                      style={{objectFit: 'cover'}}
                      priority
                    />
                  </div>
                )}
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

// export async function getServerSideProps({
//   req,
//   res,
// }: GetServerSidePropsContext) {
//   const {userId} = getAuth(req);

//   if (!userId) {
//     return {props: {}};
//   }

//   const events = await api.getMyEvents(userId);

//   res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate=59');

//   return {props: {events}};
// }
