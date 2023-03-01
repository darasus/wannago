import Link from 'next/link';
import {useCopyClipboard, useAmplitude} from 'hooks';
import {Button, Badge, CardBase, Tooltip} from 'ui';
import {getBaseUrl, cn} from 'utils';

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
      <CardBase isBlur={!isPublished}>
        <div className="mb-2">
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
        <div>
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