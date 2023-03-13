import {useEffect, useRef} from 'react';

interface Props {
  className?: string;
}

export function LoadingWave({className = 'h-5 w-5'}: Props) {
  const ref = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (ref.current) {
      buildWave(80, 60, ref.current);
    }
  }, []);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="80px"
      height="60px"
      viewBox="5 0 80 60"
      className="loading-wave stroke-gray-800"
    >
      <path
        ref={ref}
        id="wave"
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
      ></path>
    </svg>
  );
}

const m = 0.512286623256592433;

function buildWave(w: number, h: number, path: SVGPathElement) {
  const a = h / 4;
  const y = h / 2;

  const pathData = [
    'M',
    w * 0,
    y + a / 2,
    'c',
    a * m,
    0,
    -(1 - a) * m,
    -a,
    a,
    -a,
    's',
    -(1 - a) * m,
    a,
    a,
    a,
    's',
    -(1 - a) * m,
    -a,
    a,
    -a,
    's',
    -(1 - a) * m,
    a,
    a,
    a,
    's',
    -(1 - a) * m,
    -a,
    a,
    -a,

    's',
    -(1 - a) * m,
    a,
    a,
    a,
    's',
    -(1 - a) * m,
    -a,
    a,
    -a,
    's',
    -(1 - a) * m,
    a,
    a,
    a,
    's',
    -(1 - a) * m,
    -a,
    a,
    -a,
    's',
    -(1 - a) * m,
    a,
    a,
    a,
    's',
    -(1 - a) * m,
    -a,
    a,
    -a,
    's',
    -(1 - a) * m,
    a,
    a,
    a,
    's',
    -(1 - a) * m,
    -a,
    a,
    -a,
    's',
    -(1 - a) * m,
    a,
    a,
    a,
    's',
    -(1 - a) * m,
    -a,
    a,
    -a,
  ].join(' ');

  path.setAttribute('d', pathData);
}
