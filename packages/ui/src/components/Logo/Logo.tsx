import Link, {LinkProps} from 'next/link';
import {logoFont} from '../../../../../apps/web/src/fonts';
import {cn} from '../../../../utils';

interface Props extends LinkProps {
  className?: string;
}

export function Logo({className, ...props}: Props) {
  return (
    <Link {...props}>
      <LogoView className={className} />
    </Link>
  );
}

export function LogoView({className}: {className?: string}) {
  return (
    <div
      className={cn(
        logoFont.className,
        'bg-foreground rounded-md p-2 text-background uppercase leading-none text-left',
        className
      )}
    >
      <div>wanna</div>
      <div>go</div>
    </div>
  );
}
