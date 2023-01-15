import Link from 'next/link';
import useCopyClipboard from '../../hooks/useCopyClipboard';
import {Button} from '../Button/Button';
import {CardBase} from '../CardBase/CardBase';
import {Badge} from '../Badge/Badge';
import {useAmplitude} from '../../hooks/useAmplitude';

interface Props {
  url: string;
  eventId: string;
}

export function EventUrlCard({url, eventId}: Props) {
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
        <Link className="text-gray-800 font-bold hover:underline" href={url}>
          {url
            .replace('https://', '')
            .replace('http://', '')
            .replace('www.', '')}
        </Link>
      </div>
    </CardBase>
  );
}
