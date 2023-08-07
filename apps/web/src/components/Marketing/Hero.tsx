import {Suspense} from 'react';
import {titleFontClassName} from '../../fonts';
import {Button, LoadingBlock} from 'ui';
import {Container} from 'ui';
import {cn} from 'utils';
import {auth} from '@clerk/nextjs';
import EventPreview from './EventPreview';
import Link from 'next/link';
import {api} from '../../trpc/server-http';
import {Blob} from './Blob';

export function Hero() {
  return (
    <>
      <div className="absolute top-0 bottom-0 right-0 left-0 -z-[1]">
        <Blob />
      </div>
      <div className="relative">
        <div className="relative flex flex-col items-center gap-6 pt-32">
          <h1
            className={cn(
              titleFontClassName,
              'mx-auto max-w-4xl text-6xl lg:text-7xl tracking-tight text-center'
            )}
          >
            <span>
              Better way to
              <br />
              organize events
            </span>
          </h1>
          <div className="mx-auto max-w-sm text-lg tracking-tight text-center">
            <span className="font-medium">
              {`Build lasting connections with your attendees. Provide an unforgettable online experience they'll cherish — and eagerly return for.`}
            </span>
          </div>
          <Button className="pointer-events-auto" size="lg" asChild>
            <Link href={auth().userId ? '/e/add' : '/register'}>
              Create your first event
            </Link>
          </Button>
        </div>
        <Container className="py-20 lg:py-32 mb-0 relative z-10 overflow-hidden">
          <div className="flex justify-center relative w-full max-w-2xl m-auto">
            <Suspense fallback={<LoadingBlock />}>
              <EventPreview eventPromise={api.event.getRandomExample.query()} />
            </Suspense>
          </div>
        </Container>
      </div>
    </>
  );
}
