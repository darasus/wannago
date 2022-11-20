import {auth} from '@clerk/nextjs/app-beta';
import Image from 'next/image';
import Link from 'next/link';
import {Card} from '../components/Card/Card';
import {Text} from '../components/Text/Text';
import {api} from '../lib/api';

export default async function HomePage() {
  const {userId} = auth();

  const events = userId ? await api.getMyEvents(userId) : [];

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
