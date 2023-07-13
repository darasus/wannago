import {Suspense} from 'react';
import {titleFontClassName} from '../../fonts';
import {LoadingBlock} from 'ui';
import {Container} from 'ui';
import {cn} from 'utils';
import EventPreview from './EventPreview';
import {api} from '../../trpc/server-http';
import {CreateYourFirstEventButton} from './CreateYourFirstEventButton';

export function Hero() {
  return (
    <div className="relative overflow-hidden">
      <Container className="py-20 lg:py-32 mb-0 relative z-10 overflow-hidden">
        <h1
          className={cn(
            titleFontClassName,
            'mx-auto max-w-4xl text-6xl lg:text-7xl tracking-tight text-center'
          )}
        >
          <span className="mb-4">
            Better way to
            <br />
            organize events
          </span>
        </h1>
        <div className="mx-auto mt-6 max-w-sm text-lg tracking-tight text-center">
          <span className="font-medium">
            {`Build lasting connections with your attendees. Provide an unforgettable online experience they'll cherish — and eagerly return for.`}
          </span>
        </div>
        <div className="mt-10 flex justify-center gap-x-6 mb-16">
          <CreateYourFirstEventButton />
        </div>
        <div className="flex justify-center relative w-full max-w-2xl m-auto pointer-events-none">
          <Suspense fallback={<LoadingBlock />}>
            <EventPreview eventPromise={api.event.getRandomExample.query()} />
          </Suspense>
        </div>
      </Container>
    </div>
  );
}
