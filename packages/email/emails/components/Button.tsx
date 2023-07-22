import {PropsWithChildren} from 'react';
import {token, fontFamily} from './shared';
import {Button as _Button} from '@react-email/components';

interface Props extends PropsWithChildren {
  href: string;
  variant?: 'primary' | 'secondary';
}

const style = {
  fontFamily,
  borderRadius: '5px',
  fontSize: '15px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
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
    <_Button style={{...style, ...map[variant]}} pX={20} pY={10} href={href}>
      {children}
    </_Button>
  );
}
