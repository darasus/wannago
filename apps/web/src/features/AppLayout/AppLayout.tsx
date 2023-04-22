import {PropsWithChildren} from 'react';
import {Container} from 'ui';
import {Header} from './features/Header/Header';

interface Props extends PropsWithChildren {}

export function AppLayout({children}: Props) {
  return (
    <div>
      <div>
        <Container maxSize={'full'}>
          <Header />
        </Container>
      </div>
      <div>
        <div>{children}</div>
      </div>
    </div>
  );
}
