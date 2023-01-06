import Link from 'next/link';
import useCopyClipboard from '../../hooks/useCopyClipboard';
import {Button} from '../Button/Button';
import {CardBase} from '../CardBase/CardBase';
import {Badge} from '../Badge/Badge';

interface Props {
  url: string;
}

export function EventUrlCard({url}: Props) {
  const [isCopied, copy] = useCopyClipboard(url);

  return (
    <CardBase>
      <div className="mb-2">
        <Badge color="gray" className="mr-2" size="xs">
          Invite
        </Badge>
        <Button
          onClick={copy}
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
