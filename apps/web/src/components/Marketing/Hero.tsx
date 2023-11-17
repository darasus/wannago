import {titleFontClassName} from '../../fonts';
import {Container} from 'ui';
import {cn} from 'utils';
import {api} from '../../trpc/server-http';
import {HeroCta} from './HeroCta';

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
            Smooth ticketing <br className="hidden md:block" /> for private
            events
          </span>
        </h1>
        <div className="mx-auto mt-6 max-w-sm text-xl text-center font-bold text-secondary-foreground">
          {`Start selling tickets in minutes. No setup fees, and no hidden costs.`}
        </div>
        <div className="mt-10 flex justify-center gap-x-6 mb-16">
          {/* <CtaButton
            href={
              (await api.user.me.query().then((res) => Boolean(res)))
                ? '/e/add'
                : '/sign-up'
            }
          >
            Try for free
          </CtaButton> */}
          <HeroCta isLoggedIn={Boolean(me)} />
        </div>
        {/* <div className="flex justify-center relative w-full max-w-2xl m-auto">
          <EventPreview event={await api.event.getRandomExample.query()} />
        </div> */}
      </Container>
    </div>
  );
}
