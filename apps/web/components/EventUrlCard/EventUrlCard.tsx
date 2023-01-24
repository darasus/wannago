import Link from 'next/link';
import useCopyClipboard from '../../hooks/useCopyClipboard';
import {Button} from '../Button/Button';
import {CardBase} from '../CardBase/CardBase';
import {Badge} from '../Badge/Badge';
import {useAmplitude} from '../../hooks/useAmplitude';
import {cn} from '../../utils/cn';
import {Tooltip} from '../Tooltip/Tooltip';
import {getBaseUrl} from '../../utils/getBaseUrl';

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
    logEvent('copy_url_button_clicked', {eventId});
    copy();
  };

  return (
    <CardBase>
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
        <Tooltip
          text={
            isPublished
              ? undefined
              : 'To see public link please publish event first'
          }
        >
          <Link
            className={cn('text-gray-800 font-bold hover:underline', {
              'blur-[3px] pointer-events-none': !isPublished,
            })}
            href={url}
          >
            {url
              .replace('https://', '')
              .replace('http://', '')
              .replace('www.', '')}
          </Link>
        </Tooltip>
      </div>
    </CardBase>
  );
}
