import {PropsWithChildren} from 'react';
import {Container, Spinner} from 'ui';
import {Header} from '../Header/Header';

interface Props extends PropsWithChildren {
  maxSize?: 'md' | 'lg' | 'full';
  isLoading?: boolean;
}

export default function AppLayout({
  children,
  isLoading,
  maxSize = 'md',
}: Props) {
  return (
    <div>
      <div className="relative z-20">
        <Container maxSize={maxSize}>
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
