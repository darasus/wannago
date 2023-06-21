'use client';

import {CardBase} from 'ui';

export function LoadingEventCard() {
  return (
    <CardBase className="flex flex-col">
      <div className="grow overflow-hidden relative justify-center bg-gray-200 rounded-3xl aspect-video mb-4 animate-pulse" />
      <div className="animate-pulse">
        <div className="h-3 bg-gray-200 rounded col-span-2 mb-2" />
        <div className="h-3 bg-gray-200 rounded col-span-2" />
      </div>
    </CardBase>
  );
}
