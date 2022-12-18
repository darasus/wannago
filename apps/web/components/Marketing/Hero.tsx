import clsx from 'clsx';
import Image from 'next/image';
import {useRouter} from 'next/router';
import {titleFontClassName} from '../../fonts';
import {Button} from '../Button/Button';
import {Container} from '../Container/Container';

export function Hero() {
  const router = useRouter();

  return (
    <Container className="pt-20 text-center lg:pt-32 mb-0">
      <h1
        className={clsx(
          titleFontClassName,
          'mx-auto max-w-4xl text-3xl md:text-4xl lg:text-7xl tracking-tight text-slate-800'
        )}
      >
        <div>Create and share </div>
        <span className="relative whitespace-nowrap">
          {/* <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-gray-1000"> */}
          <span className="relative">beautiful event pages</span>
        </span>
      </h1>
      <p className="mx-auto mt-6 max-w-xl text-lg tracking-tight text-slate-700">
        Most event management software is too complicated and expensive.{' '}
        <span className="font-bold">We solved this problem for you.</span>
      </p>
      <div className="mt-10 flex justify-center gap-x-6 mb-16">
        <Button size="lg" onClick={() => router.push('/login')}>
          Create your first event
        </Button>
      </div>
      <div className="relative w-full max-w-4xl m-auto h-80 md:h-96 lg:h-hero-preview">
        <Image
          style={{
            objectFit: 'cover',
            objectPosition: 'top',
          }}
          className="w-full"
          src={'/images/screenshots/event-view.png'}
          alt=""
          priority
          fill
          sizes="(min-width: 1024px) 67.8125rem, (min-width: 640px) 100vw, 45rem"
        />
      </div>
    </Container>
  );
}
