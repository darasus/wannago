import Link, {LinkProps} from 'next/link';
import Image from 'next/image';
import {getBaseUrl} from 'utils';

interface Props extends LinkProps {
  className?: string;
}

export function Logo({className, ...props}: Props) {
  return (
    <Link {...props} data-testid="logo-link">
      <LogoView className={className} />
    </Link>
  );
}

export function LogoView({className}: {className?: string}) {
  const height = 100;
  const width = 152;

  return (
    <Image
      src={`${getBaseUrl()}/api/logo`}
      width={width}
      height={height}
      alt="WannaGo logo"
      priority
      style={{
        height: height * 0.5,
        width: width * 0.5,
      }}
    />
  );
}
