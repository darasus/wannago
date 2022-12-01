import Image from 'next/image';
import {Button} from '../Button/Button';
import {Container} from './Container';

export function CallToAction() {
  return (
    <section id="get-started-today" className="relative overflow-hidden py-32">
      {/* <Image
        className="absolute top-1/2 left-1/2 max-w-none -translate-x-1/2 -translate-y-1/2"
        src={'/images/background-call-to-action.jpg'}
        alt=""
        width={2347}
        height={1244}
        unoptimized
      /> */}
      <Container className="relative">
        <div className="mx-auto max-w-lg text-center">
          <h2 className="font-bold text-3xl tracking-tight sm:text-4xl">
            Get started today
          </h2>
          <p className="mt-4 text-lg tracking-tight">
            Nothing stops you from trying out WannaGo, just create account and
            see for yourself.
          </p>
          <Button variant="secondary" className="mt-10">
            Create account
          </Button>
        </div>
      </Container>
    </section>
  );
}
