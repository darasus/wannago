'use client';

import {ColoredBadge} from 'ui';
import {useSaved} from '../../hooks/useSaved';

export function SaveBadge() {
  const {isSaved, isSaving, isUnsaved} = useSaved();

  return (
    <ColoredBadge color={isSaved ? 'green' : 'default'} className="py-0.5">
      {isSaved && 'Saved'}
      {isSaving && 'Saving...'}
      {isUnsaved && 'Unsaved'}
    </ColoredBadge>
  );
}
