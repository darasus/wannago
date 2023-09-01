import {titleFontClassName} from '../../fonts';
import {Container, CtaButton} from 'ui';
import {cn} from 'utils';
import EventPreview from './EventPreview';
import {api} from '../../trpc/server-http';

export async function Hero() {
  const me = await api.user.me.query();

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
            Simplest way to
            <br />
            sell tickets online
          </span>
        </h1>
        <div className="mx-auto mt-6 max-w-sm text-lg tracking-tight text-center">
          <span className="">
            {`Start selling tickets in minutes. No setup fees, and no hidden costs.`}
          </span>
        </div>
        <div className="mt-10 flex justify-center gap-x-6 mb-16">
          <CtaButton href={me ? '/e/add' : '/sign-up'}>
            Create your first event
          </CtaButton>
        </div>
        <div className="flex justify-center relative w-full max-w-2xl m-auto">
          <EventPreview event={await api.event.getRandomExample.query()} />
        </div>
      </Container>
    </div>
  );
}
