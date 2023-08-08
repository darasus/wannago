'use client';

import {useEffect, useRef} from 'react';
import {Application} from '@splinetool/runtime';
import {useTheme} from 'next-themes';

export default function Blob() {
  const ref = useRef<HTMLCanvasElement>(null);
  const {resolvedTheme} = useTheme();

  useEffect(() => {
    if (typeof window !== 'undefined' && ref.current) {
      const app = new Application(ref.current);
      app.load(
        resolvedTheme === 'dark'
          ? 'https://prod.spline.design/uIkYeCM5LMKNkXlz/scene.splinecode'
          : 'https://prod.spline.design/fSgRvzLa1vBCVtFp/scene.splinecode'
      );
    }
  }, [resolvedTheme]);

  return (
    <div className="block h-[1000px] w-full overflow-hidden pointer-events-none border-b">
      <canvas ref={ref} id="canvas3d" className="block h-full w-full" />
    </div>
  );
}
