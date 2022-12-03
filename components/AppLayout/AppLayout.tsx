import {PropsWithChildren} from 'react';
import {Header} from '../Header/Header';
import {Container} from '../Marketing/Container';

export default function AppLayout({children}: PropsWithChildren) {
  return (
    <div>
      <div className="relative z-10">
        <Header />
      </div>
      <div className="relative">
        <Container className="px-4">{children}</Container>
      </div>
    </div>
  );
}
