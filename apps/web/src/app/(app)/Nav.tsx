'use client';

import Link from 'next/link';
import {LucideIcon} from 'lucide-react';
import {cn} from 'utils';
import {
  Avatar,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  buttonVariants,
} from 'ui';

interface NavProps {
  links: {
    title: string;
    label?: string;
    icon?: LucideIcon;
    imageSrc?: string;
    variant: 'default' | 'ghost';
    href: string;
  }[];
}

export function Nav({links}: NavProps) {
  return (
    <TooltipProvider delayDuration={0}>
      <div className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2">
        <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:px-2 justify-center">
          {links.map((link, index) => (
            <Tooltip key={index} delayDuration={0}>
              <TooltipTrigger asChild>
                <Link
                  href={link.href}
                  className={cn(
                    buttonVariants({variant: link.variant, size: 'icon'}),
                    'h-8 w-8',
                    link.variant === 'default' &&
                      'dark:bg-muted dark:text-muted-foreground'
                  )}
                >
                  {link.icon && <link.icon className="h-4 w-4" />}
                  {link.imageSrc && (
                    <Avatar
                      className="h-4 w-4"
                      src={link.imageSrc}
                      alt={'avatar'}
                    />
                  )}
                  <span className="sr-only">{link.title}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="flex items-center gap-4">
                {link.title}
                {link.label && (
                  <span className="ml-auto text-muted-foreground">
                    {link.label}
                  </span>
                )}
              </TooltipContent>
            </Tooltip>
          ))}
        </nav>
      </div>
    </TooltipProvider>
  );
}
