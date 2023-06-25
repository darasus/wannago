'use client';

import {env} from 'client-env';
import Script from 'next/script';

export function Scripts() {
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
