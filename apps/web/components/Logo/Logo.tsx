import clsx from 'clsx';
import Link, {LinkProps} from 'next/link';
import {logoFont} from '../../fonts';

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
      className={clsx(
        logoFont.className,
        'bg-gray-800 rounded-md p-2 text-slate-100 uppercase leading-none text-left',
        className
      )}
    >
      <div>wanna</div>
      <div>go</div>
    </div>
  );
}
