import {ClerkProvider} from '@clerk/nextjs';
import '../styles/globals.css';
import {Container} from 'ui';
import {Header} from './(features)/Header/Header';
import Script from 'next/script';
import {env} from 'server-env';
import {Amplitude} from '../features/Amplitude/Amplitude';
import {Sentry} from '../features/Sentry/Sentry';
import {Intercom} from '../features/Intercom/Intercom';
import {ToastProvider} from './(components)/ToastProvider';

export const metadata = {
  title: 'WannaGo',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <Scripts />
        </head>
        <body>
          <div>
            <div>
              <Container maxSize={'full'}>
                <Header />
              </Container>
            </div>
            <div>
              <div>{children}</div>
            </div>
          </div>
        </body>
        <Tools />
        <ToastProvider />
      </html>
    </ClerkProvider>
  );
}

function Tools() {
  return (
    <>
      {env.NEXT_PUBLIC_VERCEL_ENV === 'production' && (
        <>
          <Amplitude />
          <Sentry />
          <Intercom />
        </>
      )}
    </>
  );
}

function Scripts() {
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
      {/* {env.NEXT_PUBLIC_VERCEL_ENV === 'production' && (
        <Script
          id="intercom"
          strategy="afterInteractive"
          src="https://widget.intercom.io/widget/iafdg58b"
          onLoad={async () => {
            (window as any)?.Intercom?.('boot', {
              api_base: 'https://api-iam.intercom.io',
              app_id: 'iafdg58b',
            });
          }}
        />
      )} */}
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
    </>
  );
}
