import {buildClerkProps} from '@clerk/nextjs/server';
import {Event} from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';
import {NextRequest} from 'next/server';
import {Card} from '../components/Card/Card';
import {Text} from '../components/Text/Text';
import {api} from '../lib/api';

interface Props {
  events: Event[];
}

export default function HomePage({events}: Props) {
  return (
    <div>
      {events?.map(event => {
        return (
          <Link href={`/event/${event.id}`} key={event.id}>
            <Card className="p-0">
              <div className="flex items-center overflow-hidden relative justify-center h-64 bg-black rounded-t-xl">
                <Image
                  src="https://source.unsplash.com/GNwiKB34eGs"
                  alt=""
                  fill
                  style={{objectFit: 'cover'}}
                  priority
                />
              </div>
              <div className="p-4">
                <Text>{event.title}</Text>
              </div>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}

export async function getServerSideProps({req}: {req: NextRequest}) {
  const requestHeaders = new Headers(req.headers);
  const userId = requestHeaders.get('x-user-id');

  if (!userId) {
    return {props: {}};
  }

  const events = await api.getMyEvents(userId);

  return {props: {...buildClerkProps(req), events}};
}
