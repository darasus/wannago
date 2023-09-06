'use client';

import {useState} from 'react';
import {Editor} from '../core';
import {ColoredBadge} from 'ui';

export default function HomePage() {
  const [saveStatus, setSaveStatus] = useState('Saved');

  return (
    <div>
      <ColoredBadge
        color={saveStatus !== 'Saved' ? 'default' : 'green'}
        className="absolute right-5 top-5 z-10"
      >
        {saveStatus}
      </ColoredBadge>
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
  );
}
