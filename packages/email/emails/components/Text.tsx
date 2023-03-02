import {Text as _Text} from '@react-email/text';
import {PropsWithChildren} from 'react';
import {token, fontFamily} from './shared';

interface Props extends PropsWithChildren {
  style?: React.CSSProperties;
}

const textStyle = {
  fontFamily,
  fontSize: '15px',
  lineHeight: '1.4',
  color: token.dark,
  margin: 0,
};

export function Text({children, style}: Props) {
  return <_Text style={{...textStyle, ...style}}>{children}</_Text>;
}
