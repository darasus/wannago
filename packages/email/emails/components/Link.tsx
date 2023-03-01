import {PropsWithChildren} from 'react';
import {Link as _Link} from '@react-email/link';
import {token, fontFamily} from './shared';

interface Props extends PropsWithChildren {
  href: string;
}

export function Link({children, href}: Props) {
  return (
    <_Link
      href={href}
      style={{
        fontFamily,
        color: token.dark,
        textDecoration: 'underline',
      }}
    >
      {children}
    </_Link>
  );
}
