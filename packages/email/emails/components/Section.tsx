import {Section as _Section} from '@react-email/section';
import {PropsWithChildren} from 'react';

interface Props extends PropsWithChildren {
  style?: React.CSSProperties;
}

export function Section({children, style}: Props) {
  return <_Section style={{textAlign: 'left', ...style}}>{children}</_Section>;
}
