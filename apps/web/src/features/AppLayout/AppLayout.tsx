import {PropsWithChildren} from 'react';
import {Container, Spinner} from 'ui';
import {Header} from '../Header/Header';

interface Props extends PropsWithChildren {}

export function AppLayout({children}: Props) {
  return (
    <div>
      <div className="relative z-50">
        <Container maxSize={'full'}>
          <Header />
        </Container>
      </div>
      <div className="relative">
        <div>{children}</div>
      </div>
    </div>
  );
}
