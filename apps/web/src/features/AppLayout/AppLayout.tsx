import {PropsWithChildren} from 'react';
import {Container, Spinner} from 'ui';
import {Header} from '../Header/Header';

interface Props extends PropsWithChildren {
  isLoading?: boolean;
}

export function AppLayout({children, isLoading}: Props) {
  return (
    <div>
      <div className="relative z-20">
        <Container maxSize={'full'}>
          <Header />
        </Container>
      </div>
      {isLoading && (
        <div className="flex justify-center py-2">
          <Spinner />
        </div>
      )}
      {!isLoading && (
        <div>
          <div>{children}</div>
        </div>
      )}
    </div>
  );
}
