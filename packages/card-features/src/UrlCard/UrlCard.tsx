'use client';

import {UrlCard as UrlCardView} from 'cards';
import {useCopyClipboard, useAmplitudeAppDir} from 'hooks';
import {Button} from 'ui';

interface Props {
  url: string;
  eventId: string;
}

export function UrlCard({url, eventId}: Props) {
  const [isCopied, copy] = useCopyClipboard(url);
  const {logEvent} = useAmplitudeAppDir();

  const onCopyUrlClick = () => {
    logEvent('copy_event_url_button_clicked', {eventId});
    copy();
  };

  const publicEventUrl = url
    .replace('www.', '')
    .replace('http://', '')
    .replace('https://', '');

  const action = (
    <Button
      onClick={onCopyUrlClick}
      variant="link-gray"
      disabled={isCopied}
      size="xs"
    >
      {isCopied ? 'Copied!' : 'Copy url'}
    </Button>
  );

  return (
    <UrlCardView url={url} publicEventUrl={publicEventUrl} action={action} />
  );
}
