'use client';

import {Button} from 'ui';
import {usePathname} from 'next/navigation';
import {
  getIsPublic,
  navItems,
} from '../features/AppLayout/features/Header/constants';
import Link from 'next/link';

export function DesktopMenu() {
  const pathname = usePathname();
  const isPublic = getIsPublic(pathname ?? '/');

  if (!isPublic) {
    return null;
  }

  return (
    <div className="hidden md:flex gap-x-5 md:gap-x-4">
      {navItems.map((item, i) => (
        <Button asChild key={i} variant="outline" size="sm">
          <Link href={item.href}>{item.label}</Link>
        </Button>
      ))}
    </div>
  );
}
