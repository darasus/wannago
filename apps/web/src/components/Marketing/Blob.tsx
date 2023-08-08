'use client';

import {useEffect, useRef} from 'react';
import {Application} from '@splinetool/runtime';

export default function Blob() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && ref.current) {
      const app = new Application(ref.current);
      app.load('https://prod.spline.design/uIkYeCM5LMKNkXlz/scene.splinecode');
    }
  }, []);

  return (
    <div className="block h-[1000px] w-full overflow-hidden pointer-events-none border-b-2 border-primary">
      <canvas ref={ref} id="canvas3d" className="block h-full w-full" />
    </div>
  );
}
