export const exampleEvents = [
  '/e/FyThYG',
  '/e/WC1Fo6',
  '/e/59AlAn',
  '/e/0q5ipF',
  '/e/AfnfDh',
  '/e/3ggj1Y',
];

export function getIsPublic(pathname: string) {
  if (pathname === '/') return true;
  return [
    '/examples',
    '/login',
    '/register',
    '/terms',
    ...exampleEvents,
  ].includes(pathname);
}

export const navItems = [
  {label: 'Features', href: `/#features`},
  {label: 'FAQ', href: `/#faq`},
  {label: 'Examples', href: `/examples`},
  {label: 'Pricing', href: `/#pricing`},
];
