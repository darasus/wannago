import {env} from 'client-env';
import Script from 'next/script';
import {pipe} from 'ramda';
import {trpc} from 'trpc/src/trpc';
import {Amplitude} from './features/Amplitude/Amplitude';
import {Intercom} from './features/Intercom/Intercom';
import {Sentry} from './features/Sentry/Sentry';
import {ToastBar, Toaster} from 'react-hot-toast';
import {CheckCircleIcon, XCircleIcon} from '@heroicons/react/24/outline';
import {cn} from 'utils';
import {ClerkProvider} from '@clerk/nextjs';
import {useRouter} from 'next/router';
import {useEffect} from 'react';
import {pageView} from 'lib/src/gtag';

export const withProviders = pipe(
  trpc.withTRPC,
  withGoogleAnalyticsScript,
  withIntercomScript,
  withHotjarScript,
  withAmplitudeInitializer,
  withSentryInitializer,
  withIntercomInitializer,
  withToaster,
  withGoogleAnalyticsPageTransitionTracker,
  withClerkProvider
);

function withGoogleAnalyticsScript(Component: any) {
  return function Providers(props: any) {
    return (
      <>
        {env.NEXT_PUBLIC_VERCEL_ENV === 'production' && (
          <>
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
          </>
        )}
        <Component {...props} />
      </>
    );
  };
}

function withIntercomScript(Component: any) {
  return function Providers(props: any) {
    return (
      <>
        {env.NEXT_PUBLIC_VERCEL_ENV === 'production' && (
          <Script
            id="intercom"
            strategy="afterInteractive"
            src="https://widget.intercom.io/widget/iafdg58b"
            onLoad={() => {
              (window as any)?.Intercom?.('boot', {
                api_base: 'https://api-iam.intercom.io',
                app_id: 'iafdg58b',
              });
            }}
          />
        )}
        <Component {...props} />
      </>
    );
  };
}

function withHotjarScript(Component: any) {
  return function Providers(props: any) {
    return (
      <>
        {env.NEXT_PUBLIC_VERCEL_ENV === 'production' && (
          <Script id="hotjar" strategy="afterInteractive">
            {`
          (function(h,o,t,j,a,r){
              h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
              h._hjSettings={hjid:3424755,hjsv:6};
              a=o.getElementsByTagName('head')[0];
              r=o.createElement('script');r.async=1;
              r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
              a.appendChild(r);
          })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
        `}
          </Script>
        )}
        <Component {...props} />
      </>
    );
  };
}

function withAmplitudeInitializer(Component: any) {
  return function Providers(props: any) {
    return (
      <>
        {env.NEXT_PUBLIC_VERCEL_ENV === 'production' && (
          <>
            <Amplitude />
          </>
        )}
        <Component {...props} />
      </>
    );
  };
}

function withSentryInitializer(Component: any) {
  return function Providers(props: any) {
    return (
      <>
        {env.NEXT_PUBLIC_VERCEL_ENV === 'production' && (
          <>
            <Sentry />
          </>
        )}
        <Component {...props} />
      </>
    );
  };
}

function withIntercomInitializer(Component: any) {
  return function Providers(props: any) {
    return (
      <>
        {env.NEXT_PUBLIC_VERCEL_ENV === 'production' && (
          <>
            <Intercom />
          </>
        )}
        <Component {...props} />
      </>
    );
  };
}

function withToaster(Component: any) {
  return function Providers(props: any) {
    return (
      <>
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
                  className={cn(
                    'p-4 flex items-center max-w-md w-full border-2 border-gray-800 bg-white rounded-3xl'
                  )}
                  data-testid={
                    t.type === 'success' ? 'toast-success' : 'toast-success'
                  }
                >
                  <div
                    className={cn(
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
        <Component {...props} />
      </>
    );
  };
}

function withClerkProvider(Component: any) {
  return function Providers(props: any) {
    return (
      <>
        <ClerkProvider {...props} supportEmail="hi@wannago.app">
          <Component {...props} />
        </ClerkProvider>
      </>
    );
  };
}

function withGoogleAnalyticsPageTransitionTracker(Component: any) {
  return function Providers(props: any) {
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
        <Component {...props} />
      </>
    );
  };
}

// function withSomething(Component: any) {
//   return function Providers(props: any) {
//     return (
//       <>
//         <Component {...props} />
//       </>
//     );
//   };
// }
