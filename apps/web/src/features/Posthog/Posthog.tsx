'use client';

import {usePathname, useSearchParams} from 'next/navigation';
import posthog from 'posthog-js';
import {useEffect} from 'react';
import {PostHogProvider} from 'posthog-js/react';
import {env} from 'client-env';

if (typeof window !== 'undefined') {
  posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
    capture_pageview: false,
    api_host: 'https://www.wannago.app/ingest',
    ui_host: env.NEXT_PUBLIC_POSTHOG_HOST,
  });
}

export function PostHogPageview() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      let url = window.origin + pathname;
      if (searchParams && searchParams.toString()) {
        url = url + `?${searchParams.toString()}`;
      }
      posthog.capture('$pageview', {
        $current_url: url,
      });
    }
  }, [pathname, searchParams]);

  return null;
}

export function PHProvider({children}: {children: React.ReactNode}) {
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
