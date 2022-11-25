'use client';

import Link from 'next/link';
import useCopyClipboard from '../../hooks/useCopyClipboard';
import {Button} from '../Button/Button';

interface Props {
  url: string;
}

export function EventUrlCard({url}: Props) {
  const [isCopied, copy] = useCopyClipboard(url);

  return (
    <div className=" flex items-center border-2 rounded-md p-4 border-green-800 bg-green-100 border-dashed">
      <Link className="text-green-800 hover:underline" href={url}>
        {url.replace('https://', '').replace('http://', '').replace('www.', '')}
      </Link>
      <Button variant="neutral" size="xs" onClick={copy} className="ml-2">
        {isCopied ? 'Copied!' : 'Copy'}
      </Button>
    </div>
  );
}
