import '../styles/globals.css';

import {AppProps} from 'next/app';
import {ClerkProvider} from '@clerk/nextjs';
import {UserSecsion} from '../components/UserSecsion/UserSecsion';
import {Text} from '../components/Text/Text';
import {Card} from '../components/Card/Card';
import Link from 'next/link';
import Head from 'next/head';

export default function MyApp({Component, pageProps}: AppProps) {
  return (
    <>
      <Head>
        <title>WannaGo</title>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ClerkProvider>
        <div className=" p-4 max-w-xl m-auto">
          <Card className="flex mb-4">
            <Link href="/" className="mr-2">
              <Text>WannaGo</Text>
            </Link>
            <a href="/event/add">add</a>
            <div className="grow" />
            <UserSecsion />
          </Card>
          <div>
            <Component {...pageProps} />
          </div>
        </div>
      </ClerkProvider>
    </>
  );
}
