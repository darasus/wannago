import {PropsWithChildren} from 'react';
import {Text} from '@react-email/text';
import {fontFamily, token} from './shared';

interface Props extends PropsWithChildren {}

export const title = {
  fontFamily,
  fontSize: '24px',
  letterSpacing: '-0.5px',
  lineHeight: '1.3',
  color: token.dark,
  padding: '17px 0 0',
  fontWeight: 'bold',
};

export function Title({children}: Props) {
  return <Text style={title}>{children}</Text>;
}
