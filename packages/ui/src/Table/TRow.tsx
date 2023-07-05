import {PropsWithChildren} from 'react';

interface Props extends PropsWithChildren {}

export function TRow({children}: Props) {
  return <tr>{children}</tr>;
}
