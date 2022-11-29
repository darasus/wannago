import {useEffect, useState} from 'react';

export function useDebounce(value: any, delay?: number) {
  let innerDelay = delay || 300;
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, innerDelay);
    return () => {
      clearTimeout(handler);
    };
  });

  return debouncedValue;
}
