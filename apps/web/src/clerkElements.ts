import {ComponentProps} from 'react';
import {UserProfile} from '@clerk/nextjs';

type Appearance = ComponentProps<typeof UserProfile>['appearance'];

export const clerkAppearance: Appearance = {
  elements: {
    // rootBox: 'shadow-md',
    userButtonPopoverCard: 'shadow-md p-4 w-28 min-w-0',
    userPreview: 'p-0',
    userButtonAvatarBox: 'w-6 h-6 block',
    userButtonBox: 'text-md font-inherit',
    card: 'border-2 border-gray-800 bg-gray-50 p-6 rounded-3xl shadow-none',
    logoBox: 'hidden',
  },
};
