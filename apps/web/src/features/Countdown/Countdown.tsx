'use client';

import {isPast} from 'date-fns';
import {useEffect, useState} from 'react';
import {useIsMounted} from 'usehooks-ts';

interface Props {
  expires: number;
  onDone?: () => void;
}

export function Countdown({expires, onDone}: Props) {
  const [minutes, setMinutes] = useState<string | null>(null);
  const [seconds, setSeconds] = useState<string | null>(null);
  const getIsMounted = useIsMounted();

  useEffect(() => {
    const timer = setInterval(function () {
      const now = new Date().getTime();
      const distance = expires - now;
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (seconds >= 0) {
        setSeconds(String(seconds).padStart(2, '0'));
      } else {
        setSeconds(null);
      }
      if (minutes >= 0) {
        setMinutes(String(minutes).padStart(2, '0'));
      } else {
        setMinutes(null);
      }
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [expires]);

  if (isPast(expires) || minutes === null || seconds === null) {
    if (getIsMounted()) {
      onDone?.();
    }
    return null;
  }

  return `(${minutes}:${seconds})`;
}
