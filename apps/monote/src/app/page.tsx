'use client';

import {useState} from 'react';
import {Editor} from '../core';

export default function HomePage() {
  const [saveStatus, setSaveStatus] = useState('Saved');

  return (
    <div className="flex min-h-screen flex-col items-center sm:px-5 sm:pt-[calc(20vh)]">
      <div className="relative w-full max-w-screen-lg">
        <div className="absolute right-5 top-5 z-10 mb-5 rounded-lg bg-stone-100 px-2 py-1 text-sm text-stone-400">
          {saveStatus}
        </div>
        <Editor
          onUpdate={() => {
            setSaveStatus('Unsaved');
          }}
          onDebouncedUpdate={() => {
            setSaveStatus('Saving...');
            // Simulate a delay in saving.
            setTimeout(() => {
              setSaveStatus('Saved');
            }, 500);
          }}
        />
      </div>
    </div>
  );
}
