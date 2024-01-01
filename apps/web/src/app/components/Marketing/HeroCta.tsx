'use client';

import {useRouter} from 'next/navigation';
import {cn} from 'utils';

interface Props {
  isLoggedIn: boolean;
}

export function HeroCta({isLoggedIn}: Props) {
  const router = useRouter();

  return (
    <div className="transform transition duration-500 hover:scale-110">
      <button
        onClick={() => {
          if (isLoggedIn) {
            router.push('/e/add');
          } else {
            router.push('/sign-in');
          }
        }}
        className={cn(
          'animate-border inline-block rounded-full bg-white bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 bg-[length:400%_400%] p-[1px]'
        )}
      >
        <span className="block rounded-full bg-background px-6 py-3 font-bold">
          Try for free
        </span>
      </button>
    </div>
  );
}
