import {config} from 'config';
import {Container} from 'ui';
import {getBaseUrl} from 'utils';

import {api} from '../../../trpc/server-http';

import {Header} from './Header';

export const metadata = {
  title: config.name,
  metadataBase: new URL(getBaseUrl()),
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const me = await api.user.me.query();

  return (
    <div className="flex flex-col min-h-screen">
      {me && (
        <div>
          <Container>
            <Header />
          </Container>
        </div>
      )}
      <div className="grow">
        <div>{children}</div>
      </div>
    </div>
  );
}
