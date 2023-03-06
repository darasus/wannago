import Link from 'next/link';
import {useCopyClipboard, useAmplitude} from 'hooks';
import {Button, Badge, CardBase, Tooltip} from 'ui';
import {getBaseUrl, cn} from 'utils';
import {LinkIcon} from '@heroicons/react/24/outline';

interface Props {
  url: string;
  eventId: string;
  isPublished: boolean;
}

export function EventUrlCard({url: _url, eventId, isPublished}: Props) {
  const url = isPublished ? _url : `${getBaseUrl()}/e/abcdef`;
  const [isCopied, copy] = useCopyClipboard(url);
  const {logEvent} = useAmplitude();

  const onCopyUrlClick = () => {
    logEvent('copy_event_url_button_clicked', {eventId});
    copy();
  };

  const publicEventUrl = isPublished
    ? url.replace('https://www.', '').replace('http://', '')
    : `${getBaseUrl()}/e/abcdef`
        .replace('https://www.', '')
        .replace('http://', '');

  return (
    <Tooltip
      text={
        isPublished
          ? undefined
          : 'To see the public link, please publish the event first.'
      }
    >
      <CardBase isBlur={!isPublished} className="h-full">
        <div className="flex items-center mb-2">
          <Badge color="gray" className="mr-2" size="xs">
            Invite
          </Badge>
          <Button
            onClick={onCopyUrlClick}
            variant="link-gray"
            disabled={isCopied}
            size="xs"
          >
            {isCopied ? 'Copied!' : 'Copy url'}
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Link href={url}>
            <div className="flex justify-center items-center rounded-full h-10 w-10 bg-slate-200 border-2 border-gray-800">
              <LinkIcon className="h-5 w-5" />
            </div>
          </Link>
          <Link
            className={cn('text-gray-800 font-bold hover:underline')}
            href={url}
          >
            {publicEventUrl}
          </Link>
        </div>
      </CardBase>
    </Tooltip>
  );
}
