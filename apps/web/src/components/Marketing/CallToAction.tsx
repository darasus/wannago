'use client';

import {useRouter} from 'next/navigation';
import {Button} from 'ui';
import {Container} from 'ui';
import {SectionHeader} from './SectionHeader';
import {SectionContainer} from './SectionContainer';

export function CallToAction() {
  const router = useRouter();

  return (
    <SectionContainer>
      <Container className="relative my-0">
        <SectionHeader
          title="Get started today"
          description="Nothing stops you from trying out WannaGo, just create free account and see for yourself."
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
