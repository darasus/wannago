import {exampleEventIds} from 'const';

export function getIsPublic(pathname: string) {
  if (pathname === '/') return true;

  return [
    '/examples',
    '/login',
    '/register',
    '/terms',
    '/#how-does-it-work',
    '/#features',
    '/#faq',
    '/#pricing',
    ...exampleEventIds.map(a => `/e/${a}`),
  ].some(publicPathname => pathname.startsWith(publicPathname));
}

export const navItems = [
  {label: 'How does it work?', href: '/#how-does-it-work'},
  {label: 'Features', href: '/#features'},
  {label: 'FAQ', href: '/#faq'},
  {label: 'Examples', href: '/examples'},
  {label: 'Pricing', href: '/#pricing'},
];

export const legalNavItems = [
  {label: 'Terms of Service', href: '/terms-of-service'},
  {label: 'Privacy Policy', href: '/privacy-policy'},
  {label: 'Cookie Policy', href: '/cookie-policy'},
];
