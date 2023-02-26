import {PropsWithChildren} from 'react';

interface Props extends PropsWithChildren {}

export function Td({children}: Props) {
  return (
    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
      {children}
    </td>
  );
}
