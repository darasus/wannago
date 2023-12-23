import {Container} from 'ui';
import {Header} from '../../features/Header/Header';

export default function ExternalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div>
        <Container maxSize={'full'}>
          <Header />
        </Container>
      </div>
      <div>
        <div>{children}</div>
      </div>
    </>
  );
}
