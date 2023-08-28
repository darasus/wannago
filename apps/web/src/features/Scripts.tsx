import {env} from 'client-env';
import Script from 'next/script';
import {api} from '../trpc/server-http';

export async function Scripts() {
  const user = await api.user.me.query();

  return (
    <>
      {env.NEXT_PUBLIC_VERCEL_ENV === 'production' && (
        <Script
          id="tinybird"
          strategy="afterInteractive"
          src="https://unpkg.com/@tinybirdco/flock.js"
          data-host="https://api.tinybird.co"
          data-token="p.eyJ1IjogIjM0OTg5Zjg3LTcyNTYtNDNkNi05NTg4LTgwN2Y5NWZkNjhlNiIsICJpZCI6ICJmMzRkZmI0OC0yMTliLTRiZjEtOGNmMy1mZjUxZjlmZjU1NjQiLCAiaG9zdCI6ICJldV9zaGFyZWQifQ.10TE_bg_84u6gwouDkjW1iXHL5GRShksvDxY9KWw4Z4"
        />
      )}
      {/* {env.NEXT_PUBLIC_VERCEL_ENV === 'production' && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
            strategy="lazyOnload"
          />
          <Script id="google-analytics" strategy="lazyOnload">
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
        <Script id="hotjar" strategy="lazyOnload">
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
      )} */}
      {/* {env.NEXT_PUBLIC_VERCEL_ENV === 'production' && (
        <Script id="missive" strategy="lazyOnload">
          {`
          (function(d, w) {
            w.MissiveChatConfig = ${JSON.stringify({
              id: '5d2852fc-1fbb-4290-8597-7d9a254f4ded',
              user: {
                user: user?.firstName ? user?.firstName : undefined,
                email: user?.email || undefined,
                avatarUrl: user?.profileImageSrc || undefined,
              },
            })};
        
            var s = d.createElement('script');
            s.async = true;
            s.src = 'https://webchat.missiveapp.com/' + w.MissiveChatConfig.id + '/missive.js';
            if (d.head) d.head.appendChild(s);
          })(document, window);
        `}
        </Script>
      )} */}
    </>
  );
}
