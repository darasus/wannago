import {useUser} from '@clerk/nextjs';
import clsx from 'clsx';
import {useRouter} from 'next/router';
import {forwardRef} from 'react';
import {titleFontClassName} from '../../fonts';
import {Button} from '../Button/Button';
import {Container} from '../Container/Container';
import dynamic from 'next/dynamic';
import {TextAnimation} from '../TextAnimation/TextAnimation';

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
  const {isSignedIn} = useUser();
  const router = useRouter();

  return (
    <div className="relative overflow-hidden">
      <DynamicSpinningCircle />
      <Container
        ref={ref}
        className="pt-20 lg:pt-32 mb-0 relative z-10 md:pointer-events-none overflow-hidden"
      >
        <h1
          className={clsx(
            titleFontClassName,
            'mx-auto max-w-4xl text-3xl md:text-4xl lg:text-7xl tracking-tight text-gray-800 text-center'
          )}
        >
          Create
          <br /> <span className="zigzag">simple</span> and{' '}
          <span className="zigzag">stunning</span>
          <br />
          pages for your
          <br />
          <TextAnimation
            texts={[
              'private event',
              'birthday',
              'party',
              'wedding',
              'company event',
              'house viewing',
              'meetup',
              'anniversary',
              'bar and bat mitzvah',
              'family event',
              'reunion',
              'shower',
              'networking event',
              'graduation',
              'retirement party',
              'fundraiser event',
            ]}
          />
        </h1>
        <div className="mx-auto mt-6 max-w-sm text-lg tracking-tight text-gray-800 text-center">
          <span className="font-medium">
            {
              'Send killer invitations to your event and get ready to meet your guests'
            }
          </span>
        </div>
        <div className="mt-10 flex justify-center gap-x-6 mb-16">
          <Button
            className="pointer-events-auto"
            size="lg"
            onClick={() => router.push(isSignedIn ? '/event/add' : '/login')}
          >
            Create your first event
          </Button>
        </div>
        <div className="flex justify-center relative w-full m-auto h-80 md:h-96 lg:h-hero-preview">
          <DynamicEventPreview />
        </div>
      </Container>
    </div>
  );
});
