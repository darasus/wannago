'use client';

import resolveConfig from 'tailwindcss/resolveConfig';
import {useState, useEffect} from 'react';
import throttle from 'lodash.throttle';
import tailwindConfig from '../../../apps/web/tailwind.config.js';
import {keys} from 'ramda';

const fullConfig = resolveConfig(tailwindConfig);

const findKeyByValue = (object: any, value: any) =>
  Object.keys(object).find(key => object[key] === value);

const getDeviceConfig = (width: number) => {
  const screens = fullConfig.theme?.screens!;

  const bpSizes = keys(screens).map(screenSize => {
    const size = (screens[screenSize] as string).replace('px', '');
    return Number(size);
  });

  const bpShapes = bpSizes.map((size, index) => ({
    min: !index ? 0 : bpSizes[index - 1],
    max: size,
    key: findKeyByValue(screens, `${size}px`),
  }));

  let breakpoint = '';

  bpShapes.forEach(shape => {
    if (!shape.min && width < shape.max) {
      breakpoint = shape.key!;
    } else if (width >= shape.min && width < shape.max) {
      breakpoint = shape.key!;
    } else if (!shape.max && width >= shape.max) {
      breakpoint = shape.key!;
    }
  });

  return breakpoint;
};

export const useBreakpoint = () => {
  const width = typeof window !== 'undefined' ? window.innerWidth : 0;

  const [brkPnt, setBrkPnt] = useState(() => getDeviceConfig(width));

  useEffect(() => {
    const calcInnerWidth = throttle(function () {
      setBrkPnt(getDeviceConfig(width));
    }, 200);
    window.addEventListener('resize', calcInnerWidth);
    return () => window.removeEventListener('resize', calcInnerWidth);
  }, [width]);

  return brkPnt;
};
