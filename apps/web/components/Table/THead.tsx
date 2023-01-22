import {PropsWithChildren} from 'react';

interface Props extends PropsWithChildren {}

export function THead({children}: Props) {
  return <thead className="bg-gray-50">{children}</thead>;
}
