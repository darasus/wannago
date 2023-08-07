'use client';

import {useEffect, useRef} from 'react';
import {Application} from '@splinetool/runtime';
import {getBaseUrl} from 'utils';

export function Blob() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && ref.current) {
      const app = new Application(ref.current);
      app.load(`${getBaseUrl()}/animation_3.spline`);
    }
  }, []);

  return (
    <div className="block h-[800px] w-full overflow-hidden">
      <canvas ref={ref} id="canvas3d" className="block h-full w-full" />
    </div>
  );
}
