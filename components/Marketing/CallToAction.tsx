import Image from 'next/image';
import {Button} from '../Button/Button';
import {Container} from './Container';
import {SecionHeader} from './SecionHeader';

export function CallToAction() {
  return (
    <section className="relative overflow-hidden py-32">
      <Container className="relative my-0">
        <SecionHeader
          title="Get started today"
          description="Nothing stops you from trying out WannaGo, just create account and
            see for yourself."
        />
        <div className="flex justify-center">
          <Button>Create account</Button>
        </div>
      </Container>
    </section>
  );
}
