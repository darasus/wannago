import {env} from './env/client';

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
