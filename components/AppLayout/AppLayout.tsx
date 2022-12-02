import {PropsWithChildren} from 'react';
import {Header} from '../Header/Header';
import {Container} from '../Marketing/Container';

export default function AppLayout({children}: PropsWithChildren) {
  return (
    <div>
      <Header />
      <Container>{children}</Container>
    </div>
  );
}
