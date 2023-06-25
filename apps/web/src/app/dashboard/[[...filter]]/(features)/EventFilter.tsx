'use client';

import {useRouter} from 'next/navigation';
import {usePathname} from 'next/navigation';
import {Button, Menu} from 'ui';

export function EventFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const isPast = pathname?.startsWith('/dashboard/past');

  const handleOnClick = () => {
    if (isPast) {
      router.push('/dashboard');
    } else {
      router.push('/dashboard/past');
    }
  };

  return (
    <>
      <Menu
        activeHref={pathname ?? '/'}
        size="sm"
        options={[
          {
            label: 'All',
            href: '/dashboard/all',
          },
          {
            label: 'Attending',
            href: '/dashboard/attending',
          },
          {
            label: 'Following',
            href: '/dashboard/following',
          },
          {
            label: 'Organizing',
            href: '/dashboard/organizing',
          },
        ]}
      />
      <Button
        variant={isPast ? 'primary' : 'neutral'}
        size="sm"
        onClick={handleOnClick}
      >
        Show past
      </Button>
    </>
  );
}
