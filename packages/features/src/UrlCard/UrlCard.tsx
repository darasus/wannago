'use client';

import {useCopyClipboard, useTracker} from 'hooks';
import {Link as LinkIcon} from 'lucide-react';
import Link from 'next/link';
import {Button, CardBase} from 'ui';

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
    <CardBase className="h-full" title={'Invite'} titleChildren={action}>
      <div className="flex items-center gap-x-2">
        <Link href={url}>
          <div className="flex justify-center items-center rounded-full h-10 w-10 bg-muted dark:bg-white/[.04] border">
            <LinkIcon className="h-5 w-5" />
          </div>
        </Link>
        <Button variant="link" asChild className="p-0 h-auto">
          <Link href={url}>{publicEventUrl}</Link>
        </Button>
      </div>
    </CardBase>
  );
}
