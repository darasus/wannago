'use client';

import {
  Button,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuItem,
} from 'ui';
import {Check, Menu as MenuIcon, Monitor, Moon, SunDim} from 'lucide-react';
import {useTheme} from 'next-themes';

const appearances = [
  {
    theme: 'System',
    icon: <Monitor className="h-4 w-4" />,
  },
  {
    theme: 'Light',
    icon: <SunDim className="h-4 w-4" />,
  },
  {
    theme: 'Dark',
    icon: <Moon className="h-4 w-4" />,
  },
];

export default function Menu() {
  const {theme: currentTheme, setTheme} = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="p-0 h-6 w-6 flex items-center" variant={'ghost'}>
          <MenuIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Appearance</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {appearances.map(({theme, icon}) => (
            <DropdownMenuItem
              className="flex items-center gap-2"
              key={theme}
              onClick={() => {
                setTheme(theme.toLowerCase());
              }}
            >
              {icon}
              <span>{theme}</span>
              {currentTheme === theme.toLowerCase() && (
                <Check className="h-4 w-4" />
              )}
            </DropdownMenuItem>
            // <button
            //   key={theme}
            //   className="flex w-full items-center justify-between rounded px-2 py-1.5 text-sm text-stone-600 hover:bg-stone-100"
            //   onClick={() => {
            //     setTheme(theme.toLowerCase());
            //   }}
            // >
            //   <div className="flex items-center space-x-2">
            //     <div className="rounded-sm border border-stone-200 p-1">
            //       {icon}
            //     </div>
            //     <span>{theme}</span>
            //   </div>
            //   {currentTheme === theme.toLowerCase() && (
            //     <Check className="h-4 w-4" />
            //   )}
            // </button>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
