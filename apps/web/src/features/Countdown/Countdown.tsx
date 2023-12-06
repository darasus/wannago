'use client';

import {isPast} from 'date-fns';
import {useEffect, useState} from 'react';

interface Props {
  expires: number;
}

export function Countdown({expires}: Props) {
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const x = setInterval(function () {
      const now = new Date().getTime();
      const distance = expires - now;
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      setSeconds(seconds);
      setMinutes(minutes);
    }, 1000);
  }, [expires]);

  if (isPast(expires)) {
    return null;
  }

  return `${minutes}:${seconds}`;
}
