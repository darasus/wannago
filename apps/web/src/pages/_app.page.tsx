import '../styles/globals.css';

import {AppProps} from 'next/app';
import Head from 'next/head';
import {bodyFont} from '../fonts';
import {getBaseUrl, cn} from 'utils';
import {AppLayout} from '../features/AppLayout/AppLayout';
import {withProviders} from '../providers';

function MyApp({Component, pageProps}: AppProps) {
  return (
    <>
      <Head>
        <link rel="shortcut icon" href={`${getBaseUrl()}/api/favicon`} />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>
      <div className={cn(bodyFont.className)}>
        <AppLayout>
          <Component {...pageProps} />
        </AppLayout>
      </div>
    </>
  );
}

export default withProviders(MyApp);
