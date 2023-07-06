'use client';

import {ChevronDown} from 'lucide-react';
import {useRouter} from 'next/navigation';
import {usePathname} from 'next/navigation';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'ui';

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

  const options = [
    ['All', '/dashboard/all'],
    ['Attending', '/dashboard/attending'],
    ['Following', '/dashboard/following'],
    ['Organizing', '/dashboard/organizing'],
  ];

  const getLabel = () => {
    const label = options.find(([label]) => {
      if (pathname?.includes(label.toLowerCase())) {
        return label;
      }
    })?.[0];

    if (label) {
      return label;
    }

    return 'Filter';
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild data-testid="filter-button">
          <Button variant="outline" size="sm">
            {getLabel()}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuGroup>
            {options.map(([label, url]) => {
              return (
                <DropdownMenuItem
                  key={url}
                  onClick={() => {
                    router.push(url);
                  }}
                  data-testid="filter-option-button"
                >
                  <span>{label}</span>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button
        variant={isPast ? 'default' : 'outline'}
        size="sm"
        onClick={handleOnClick}
      >
        Show past
      </Button>
    </>
  );
}
