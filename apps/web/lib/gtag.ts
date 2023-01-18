import {env} from 'client-env';

export function pageView(url: URL) {
  window?.gtag('config', env.NEXT_PUBLIC_GA_MEASUREMENT_ID, {
    page_path: url,
  });
}

type GTagEvent = {
  action: string;
  category?: string;
  label?: string;
  value?: number;
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const logEvent = ({action, category, label, value}: GTagEvent) => {
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

export const trackEventCreateConversion = () => {
  window.gtag('event', 'conversion', {
    send_to: 'AW-11052152044/k6AECKyb1oYYEOzpiZYp',
  });
};
