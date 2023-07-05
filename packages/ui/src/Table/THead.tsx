import {PropsWithChildren} from 'react';

interface Props extends PropsWithChildren {}

export function THead({children}: Props) {
  return <thead className="">{children}</thead>;
}
