import Link, {LinkProps} from 'next/link';
import {logoFont} from '../../../../../apps/web/fonts';
import {cn} from 'browser-utils';

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
        'bg-gray-800 rounded-md p-2 text-gray-50 uppercase leading-none text-left',
        className
      )}
    >
      <div>wanna</div>
      <div>go</div>
    </div>
  );
}
