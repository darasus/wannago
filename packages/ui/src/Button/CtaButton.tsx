import Link from 'next/link';
import {Button} from './Button';

interface Props {
  children: React.ReactNode;
  href: string;
}

export function CtaButton(props: Props) {
  return (
    <Button className="pointer-events-auto " size="lg" asChild>
      <Link href={props.href}>{props.children}</Link>
    </Button>
  );
}
