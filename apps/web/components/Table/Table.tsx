import {PropsWithChildren} from 'react';
import {CardBase} from '../CardBase/CardBase';

interface Props extends PropsWithChildren {}

export function Table({children}: Props) {
  return (
    <CardBase>
      <div className="flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
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
