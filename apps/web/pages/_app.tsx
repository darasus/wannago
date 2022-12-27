import '../styles/globals.css';

import {AppProps} from 'next/app';
import {ClerkProvider} from '@clerk/nextjs';
import Head from 'next/head';
import {clerkAppearance} from '../clerkElements';
import {trpc} from '../utils/trpc';
import {ToastBar, Toaster} from 'react-hot-toast';
import {bodyFont} from '../fonts';
import clsx from 'clsx';
import {getBaseUrl} from '../utils/getBaseUrl';
import {Analytics} from '@vercel/analytics/react';
import {CheckCircleIcon, XCircleIcon} from '@heroicons/react/24/outline';
import Script from 'next/script';
import {env} from '../lib/env/client';
import {pageView} from '../lib/gtag';
import {useEffect} from 'react';
import {useRouter} from 'next/router';

function MyApp({Component, pageProps}: AppProps) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: URL) => {
      pageView(url);
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      <Head>
        <link rel="shortcut icon" href={`${getBaseUrl()}/api/favicon`} />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
        `}
      </Script>
      <div className={clsx(bodyFont.className, 'text-slate-800')}>
        <ClerkProvider
          {...pageProps}
          appearance={clerkAppearance}
          supportEmail="hi@wannago.app"
        >
          <Toaster>
            {t => (
              <ToastBar
                toast={t}
                style={{
                  padding: 0,
                  backgroundColor: 'transparent',
                  boxShadow: 'none',
                }}
              >
                {({message}) => (
                  <div
                    className={clsx(
                      'p-4 flex items-center max-w-md w-full border-2 border-slate-800 bg-brand-600 rounded-3xl'
                    )}
                  >
                    <div
                      className={clsx(
                        'flex justify-center items-center shrink-0 h-7 w-7 rounded-full mr-2 border',
                        {
                          'bg-green-600 border-green-700': t.type === 'success',
                          'bg-red-600 border-red-700': t.type === 'error',
                        }
                      )}
                    >
                      {t.type === 'success' && (
                        <CheckCircleIcon
                          className="h-6 w-6 m-0 text-gray-50"
                          style={{marginRight: 0}}
                        />
                      )}
                      {t.type === 'error' && (
                        <XCircleIcon
                          className="h-6 w-6 m-0 text-gray-50"
                          style={{marginRight: 0}}
                        />
                      )}
                    </div>
                    <div className="leading-snug">{message}</div>
                  </div>
                )}
              </ToastBar>
            )}
          </Toaster>
          <Component {...pageProps} />
        </ClerkProvider>
      </div>
      <Analytics />
    </>
  );
}

export default trpc.withTRPC(MyApp);
