export const REMINDER_PERIOD_IN_SECONDS = 60 * 60 * 3; // 3 hours
export const ONE_WEEK_IN_SECONDS = 60 * 60 * 24 * 7;
export const exampleEventIds = [
  // prod
  '7WPjci',
  'rv3f92',
  // dev
  'pg15re',
];

export const feeAmount = 50;
export const feePercent = 0.05;

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
    ...exampleEventIds.map((a) => `/e/${a}`),
  ].some((publicPathname) => pathname.startsWith(publicPathname));
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
