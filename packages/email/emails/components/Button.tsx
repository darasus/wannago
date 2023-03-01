import {PropsWithChildren} from 'react';
import {token, fontFamily} from './shared';
import {Button as _Button} from '@react-email/button';

interface Props extends PropsWithChildren {
  href: string;
  variant?: 'primary' | 'secondary';
}

const style = {
  fontFamily,
  borderRadius: '100px',
  fontSize: '15px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '15px 25px',
  borderWidth: '1px',
  borderColor: token.dark,
  borderStyle: 'solid',
};

const map = {
  primary: {
    color: token.light,
    backgroundColor: token.brand,
  },
  secondary: {
    color: token.dark,
    backgroundColor: token.light,
  },
};

export function Button({children, href, variant = 'primary'}: Props) {
  return (
    <_Button style={{...style, ...map[variant]}} href={href}>
      {children}
    </_Button>
  );
}
