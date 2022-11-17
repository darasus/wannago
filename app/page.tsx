import {currentUser} from '@clerk/nextjs/app-beta';
import Link from 'next/link';
import {prisma} from '../lib/prisma';

export default async function HomePage() {
  const user = await currentUser();
  const events = await prisma.event.findMany({
    where: {
      authorId: user?.id,
    },
  });

  return (
    <div>
      {events.map(event => {
        return (
          <Link href={`/event/${event.id}`} key={event.id}>
            {event.title}
          </Link>
        );
      })}
    </div>
  );
}
