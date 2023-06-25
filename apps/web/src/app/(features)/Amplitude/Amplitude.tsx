'use client';

import {useCallback, useEffect} from 'react';
import {useAmplitudeAppDir} from 'hooks';
import {useInitiateAmplitude} from 'hooks';
import {getBaseUrl} from 'utils';
import {usePathname, useSearchParams} from 'next/navigation';

function AmplitudeRouteTracker() {
  const {logEvent} = useAmplitudeAppDir();
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

export function Amplitude() {
  const {isInitiated} = useInitiateAmplitude();

  if (!isInitiated) {
    return null;
  }

  return <AmplitudeRouteTracker />;
}
