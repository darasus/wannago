'use client';

import {UrlCard as UrlCardView} from 'cards';
import {useCopyClipboard, useAmplitude} from 'hooks';
import {Button} from 'ui';
import {getBaseUrl} from 'utils';

interface Props {
  url: string;
  eventId: string;
  isPublished: boolean;
}

export function UrlCard({url: _url, eventId, isPublished}: Props) {
  const url = isPublished ? _url : `${getBaseUrl()}/e/abcdef`;
  const [isCopied, copy] = useCopyClipboard(url);
  const {logEvent} = useAmplitude();

  const onCopyUrlClick = () => {
    logEvent('copy_event_url_button_clicked', {eventId});
    copy();
  };

  const publicEventUrl = isPublished
    ? url.replace('www.', '').replace('http://', '').replace('https://', '')
    : `${getBaseUrl()}/e/abcdef`
        .replace('www.', '')
        .replace('https://', '')
        .replace('http://', '');

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
    <UrlCardView
      url={url}
      publicEventUrl={publicEventUrl}
      isPublished={isPublished}
      action={action}
    />
  );
}
