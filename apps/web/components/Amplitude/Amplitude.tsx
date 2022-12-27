import {useRouter} from 'next/router';
import {useCallback, useEffect} from 'react';
import {useAmplitude} from '../../hooks/useAmplitude';
import {useInitiateAmplitude} from '../../hooks/useInitiateAmplitude';
import {getBaseUrl} from '../../utils/getBaseUrl';

function AmplitudeRouteTracker() {
  const router = useRouter();
  const {logEvent} = useAmplitude();

  const handleRouteChange = useCallback(
    (url: URL) => {
      logEvent('page_viewed', {pathname: url.pathname});
    },
    [logEvent]
  );

  // INFO: log event on mount
  useEffect(() => {
    handleRouteChange(new URL(`${getBaseUrl()}${router.asPath}`));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events, logEvent, handleRouteChange]);

  return null;
}

export function Amplitude() {
  const {isInitiated} = useInitiateAmplitude();

  if (!isInitiated) {
    return null;
  }

  return <AmplitudeRouteTracker />;
}
