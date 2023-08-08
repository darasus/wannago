import Link, {LinkProps} from 'next/link';
import Image from 'next/image';
import {getBaseUrl} from 'utils';
import {useTheme} from 'next-themes';

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
  const {resolvedTheme} = useTheme();
  const height = 70;
  const width = 152;

  return (
    <div className="h-[40px] flex items-center">
      <Image
        src={
          resolvedTheme === 'dark'
            ? `${getBaseUrl()}/logo-light.png`
            : `${getBaseUrl()}/logo-dark.png`
        }
        width={width}
        height={height}
        alt="WannaGo logo"
        priority
        style={{
          height: height * 0.4,
          width: width * 0.4,
        }}
      />
    </div>
  );
}
