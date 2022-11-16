'use client';

import {usePathname, useRouter} from 'next/navigation';
import {useCallback} from 'react';
import {useParsedQueryState} from './useParsedQueryState';

export function useQueryState<T extends object>() {
  const state = useParsedQueryState<T>();
  const {push} = useRouter();
  const pathname = usePathname();

  const setState = useCallback(
    (data: Partial<T>) => {
      push(`${pathname}?data=${btoa(JSON.stringify({...state, data}))}`);
    },
    [push, pathname, state]
  );

  return {state, setState};
}
