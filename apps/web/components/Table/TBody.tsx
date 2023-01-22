import {PropsWithChildren} from 'react';

interface Props extends PropsWithChildren {}

export function TBody({children}: Props) {
  return <tbody className="divide-y-2 divide-gray-800">{children}</tbody>;
}
