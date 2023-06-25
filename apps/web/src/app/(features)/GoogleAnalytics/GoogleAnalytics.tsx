'use client';

import {pageView} from 'lib/src/gtag';
import {useSearchParams} from 'next/navigation';
import {usePathname} from 'next/navigation';
import {useEffect} from 'react';
import {getBaseUrl} from 'utils';

const handleRouteChange = (url: URL) => {
  pageView(url);
};

export function GoogleAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    handleRouteChange(new URL(`${getBaseUrl()}${pathname}?${searchParams}`));
  }, [pathname, searchParams]);

  return null;
}
