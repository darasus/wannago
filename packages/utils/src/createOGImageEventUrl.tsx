import {getBaseUrl} from './getBaseUrl';

interface Props {
  title: string;
  organizerName: string;
  eventImageUrl: string;
  organizerProfileImageUrl: string;
}

export function createOGImageEventUrl({
  title,
  eventImageUrl,
  organizerName,
  organizerProfileImageUrl,
}: Props) {
  const url = new URL(`${getBaseUrl()}/api/og-image`);

  url.searchParams.append('title', title);
  url.searchParams.append('organizerName', organizerName);
  url.searchParams.append(
    'eventImageUrl',
    btoa(encodeURIComponent(eventImageUrl))
  );
  url.searchParams.append(
    'organizerProfileImageUrl',
    btoa(encodeURIComponent(organizerProfileImageUrl))
  );

  return url.toString();
}
