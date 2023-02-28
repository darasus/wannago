import {PropsWithChildren} from 'react';
import {Container} from 'ui';
import {Header} from '../Header/Header';

interface Props extends PropsWithChildren {
  maxSize?: 'md' | 'lg' | 'full';
}

export default function AppLayout({children, maxSize = 'md'}: Props) {
  return (
    <div>
      <div className="relative z-20">
        <Container maxSize={maxSize}>
          <Header />
        </Container>
      </div>
      <div>
        <div>{children}</div>
      </div>
    </div>
  );
}
