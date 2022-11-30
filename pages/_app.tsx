import '../styles/globals.css';

import {AppProps} from 'next/app';
import {ClerkProvider} from '@clerk/nextjs';
import Head from 'next/head';
import {clerkAppearance} from '../clerkElements';
import {trpc} from '../utils/trpc';
import {Toaster} from 'react-hot-toast';
import {bodyFont} from '../fonts';

function MyApp({Component, pageProps}: AppProps) {
  return (
    <>
      <Head>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={bodyFont.className}>
        <ClerkProvider {...pageProps} appearance={clerkAppearance}>
          <Toaster />
          <Component {...pageProps} />
        </ClerkProvider>
      </div>
    </>
  );
}

export default trpc.withTRPC(MyApp);
