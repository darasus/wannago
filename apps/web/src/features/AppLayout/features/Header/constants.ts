import {exampleEventIds} from 'const';

export function getIsPublic(pathname: string) {
  if (pathname === '/') return true;
  return [
    '/examples',
    '/login',
    '/register',
    '/terms',
    ...exampleEventIds.map(a => `/e/${a}`),
  ].includes(pathname);
}

export const navItems = [
  {label: 'Features', href: `/#features`},
  {label: 'FAQ', href: `/#faq`},
  {label: 'Examples', href: `/examples`},
  {label: 'Pricing', href: `/#pricing`},
];
