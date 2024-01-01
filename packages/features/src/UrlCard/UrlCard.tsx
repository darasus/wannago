'use client';

import {UrlCardView} from './UrlCardView';
import {useCopyClipboard, useTracker} from 'hooks';
import {Button} from 'ui';

interface Props {
  url: string;
  eventId: string;
}

export function UrlCard({url, eventId}: Props) {
  const [isCopied, copy] = useCopyClipboard(url);
  const {logEvent} = useTracker();

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
      variant="link"
      disabled={isCopied}
      size="sm"
      className="p-0 h-auto"
    >
      {isCopied ? 'Copied!' : 'Copy url'}
    </Button>
  );

  return (
    <UrlCardView url={url} publicEventUrl={publicEventUrl} action={action} />
  );
}
