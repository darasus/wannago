'use client';

import Link from 'next/link';
import useCopyClipboard from '../../hooks/useCopyClipboard';
import {Button} from '../Button/Button';
import {Card} from '../DateCard/Card/Card';
import {SectionTitle} from '../Text/SectionTitle';

interface Props {
  url: string;
}

export function EventUrlCard({url}: Props) {
  const [isCopied, copy] = useCopyClipboard(url);

  return (
    <Card className="border-2 border-b-2 border-green-500 bg-green-50 border-dashed">
      <SectionTitle color="green" className="mr-2">
        Invite
      </SectionTitle>
      <div className="flex items-center">
        <Link className="text-green-800 hover:underline" href={url}>
          {url
            .replace('https://', '')
            .replace('http://', '')
            .replace('www.', '')}
        </Link>
        <Button variant="neutral" size="xs" onClick={copy} className="ml-2">
          {isCopied ? 'Copied!' : 'Copy'}
        </Button>
      </div>
    </Card>
  );
}
