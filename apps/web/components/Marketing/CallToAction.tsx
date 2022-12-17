import {useRouter} from 'next/router';
import {Button} from '../Button/Button';
import {Container} from '../Container/Container';
import {SecionHeader} from './SecionHeader';
import {SectionContainer} from './SectionContainer';

export function CallToAction() {
  const router = useRouter();

  return (
    <SectionContainer>
      <Container className="relative my-0">
        <SecionHeader
          title="Get started today"
          description="Nothing stops you from trying out WannaGo, just create account and
            see for yourself."
        />
        <div className="flex justify-center">
          <Button size="lg" onClick={() => router.push('/login')}>
            Create account
          </Button>
        </div>
      </Container>
    </SectionContainer>
  );
}
