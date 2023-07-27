'use client';

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from 'ui';
import {useAuth} from '@clerk/nextjs';
import {usePathname} from 'next/navigation';
import {Menu} from 'lucide-react';
import {getIsPublic, navItems} from 'const';
import Link from 'next/link';

export function MobileMenu() {
  const pathname = usePathname();
  const isPublic = getIsPublic(pathname ?? '/');
  const auth = useAuth();

  if (!isPublic) {
    return null;
  }

  const showAuthButtons = auth.isLoaded && !auth.isSignedIn;

  return (
    <div className="-mr-1 md:hidden">
      <DropdownMenu>
        <DropdownMenuTrigger data-testid="mobile-nav-button" asChild>
          <Button size="icon" variant={'outline'}>
            <Menu />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <>
            {navItems.map((item, i) => (
              <DropdownMenuItem key={i} asChild>
                <Link href={item.href}>{item.label}</Link>
              </DropdownMenuItem>
            ))}
            {showAuthButtons && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild data-testid="mobile-login-button">
                  <Link className="font-bold" href={'/login'}>
                    Login
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild data-testid="mobile-register-button">
                  <Link className="font-bold" href={'/register'}>
                    Register
                  </Link>
                </DropdownMenuItem>
              </>
            )}
          </>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
