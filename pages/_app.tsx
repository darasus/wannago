import '../styles/globals.css';

import {AppProps} from 'next/app';
import {ClerkProvider} from '@clerk/nextjs';
import Head from 'next/head';
import {clerkAppearance} from '../clerkElements';
import {trpc} from '../utils/trpc';
import {Toaster} from 'react-hot-toast';
import {bodyFont} from '../fonts';
import clsx from 'clsx';
import {getBaseUrl} from '../utils/getBaseUrl';
import {Analytics} from '@vercel/analytics/react';

function MyApp({Component, pageProps}: AppProps) {
  return (
    <>
      <Head>
        <link rel="shortcut icon" href={`${getBaseUrl()}/api/favicon`} />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>
      <div className={clsx(bodyFont.className, 'text-gray-800')}>
        <ClerkProvider
          {...pageProps}
          appearance={clerkAppearance}
          supportEmail="hi@wannago.app"
        >
          <Toaster />
          <Component {...pageProps} />
        </ClerkProvider>
      </div>
      <Analytics />
    </>
  );
}

export default trpc.withTRPC(MyApp);
