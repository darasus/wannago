import {useRouter} from 'next/router';
import {forwardRef} from 'react';
import {titleFontClassName} from '../../fonts';
import {Button} from 'ui';
import {Container} from 'ui';
import dynamic from 'next/dynamic';
import {cn} from 'utils';
import {useAuth} from '@clerk/nextjs';

const DynamicSpinningCircle = dynamic(() => import('./SpinningCircle'), {
  ssr: false,
});

const DynamicEventPreview = dynamic(() => import('./EventPreview'), {
  ssr: false,
});

export const Hero = forwardRef(function Hero(
  _,
  ref: React.Ref<HTMLDivElement>
) {
  const auth = useAuth();
  const router = useRouter();

  return (
    <div className="relative overflow-hidden">
      <DynamicSpinningCircle />
      <Container
        ref={ref}
        className="pt-20 lg:pt-32 mb-0 relative z-10 md:pointer-events-none overflow-hidden"
      >
        <h1
          className={cn(
            titleFontClassName,
            'mx-auto max-w-4xl text-6xl lg:text-7xl tracking-tight text-center',
            'bg-clip-text bg-gradient-to-br from-brand-100 to-brand-1000',
            'pb-2'
          )}
        >
          <span className="block text-transparent mb-4">
            <div>Better way to</div>
            <div>organize events</div>
          </span>
        </h1>
        <div className="mx-auto mt-6 max-w-sm text-lg tracking-tight text-gray-800 text-center">
          <span className="font-medium">
            {`Build lasting connections with your attendees. Provide an unforgettable online experience they'll cherish — and eagerly return for.`}
          </span>
        </div>
        <div className="mt-10 flex justify-center gap-x-6 mb-16">
          <Button
            className="pointer-events-auto"
            size="lg"
            onClick={() =>
              router.push(auth.isSignedIn ? '/e/add' : '/register')
            }
          >
            Create your first event
          </Button>
        </div>
        <div className="flex justify-center relative w-full max-w-2xl m-auto h-[400px] md:h-[900px]">
          <DynamicEventPreview />
        </div>
      </Container>
    </div>
  );
});
