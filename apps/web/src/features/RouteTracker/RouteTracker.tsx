'use client';

import {useCallback, useEffect} from 'react';
import {useTracker} from 'hooks';
import {getBaseUrl} from 'utils';
import {usePathname, useSearchParams} from 'next/navigation';

function RouteTrackerInternal() {
  const {logEvent} = useTracker();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleRouteChange = useCallback(
    (url: URL) => {
      logEvent('page_viewed', {pathname: url.pathname});
    },
    [logEvent]
  );

  useEffect(() => {
    handleRouteChange(new URL(`${getBaseUrl()}${pathname}?${searchParams}`));
  }, [pathname, handleRouteChange, searchParams]);

  return null;
}

export function RouteTracker() {
  return <RouteTrackerInternal />;
}
