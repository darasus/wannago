import './globals.css';

import {Container} from 'ui';
import {getBaseUrl} from 'utils';
import {Header} from '../features/Header/Header';
import {Tools} from '../features/Tools';
import {ToastProvider} from '../features/ToastProvider';
import {Scripts} from '../features/Scripts';
import {ClientProvider} from './ClientProvider';
import {api} from '../trpc/server-http';
import {ClientRefresher} from './features/ClientRefresher/ClientRefresher';

export const metadata = {
  title: 'WannaGo',
  metadataBase: new URL(getBaseUrl()),
};

export const runtime = 'edge';
export const preferredRegion = 'iad1';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const me = await api.user.me.query();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="shortcut icon" href={`${getBaseUrl()}/favicon.png`} />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
        />
      </head>
      <body>
        <ClientProvider>
          <div>
            <Container maxSize={'full'}>
              <Header
                me={me}
                hasUnseenConversationPromise={api.conversation.getUserHasUnseenConversation.query()}
              />
            </Container>
          </div>
          <div>
            <div>{children}</div>
          </div>
          <Tools />
          <ToastProvider />
          <ClientRefresher />
        </ClientProvider>
      </body>
      <Scripts />
    </html>
  );
}
