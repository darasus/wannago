import Link from 'next/link';
import useCopyClipboard from '../../../hooks/useCopyClipboard';
import {Button} from '../../Button/Button';
import {CardBase} from '../CardBase/CardBase';
import {Badge} from '../../Badge/Badge';
import clsx from 'clsx';

interface Props {
  url: string;
}

export function EventUrlCard({url}: Props) {
  const [isCopied, copy] = useCopyClipboard(url);

  return (
    <CardBase className="border-2 border-b-2 border-green-500 bg-green-50 border-dashed">
      <div className="mb-2">
        <Badge color="green" className="mr-2">
          Invite
        </Badge>
        <Button onClick={copy} variant="link-neutral" disabled={isCopied}>
          {isCopied ? 'Copied!' : 'Copy url'}
        </Button>
      </div>
      <div>
        <Link className="text-green-800 hover:underline" href={url}>
          {url
            .replace('https://', '')
            .replace('http://', '')
            .replace('www.', '')}
        </Link>
      </div>
    </CardBase>
  );
}
