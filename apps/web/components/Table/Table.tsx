import {PropsWithChildren} from 'react';
import {CardBase} from 'ui';

interface Props extends PropsWithChildren {}

export function Table({children}: Props) {
  return (
    <CardBase>
      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow-none">
              <table className="min-w-full divide-y-2 divide-gray-800">
                {children}
              </table>
            </div>
          </div>
        </div>
      </div>
    </CardBase>
  );
}
