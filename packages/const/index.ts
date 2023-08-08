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

export const proseClassname =
  'prose dark:prose-invert' +
  ' ' +
  'prose-h1:text-gray-900 prose-h2:text-gray-900 prose-h3:text-gray-900 prose-h4:text-gray-900 prose-h5:text-gray-900 prose-h6:text-gray-900' +
  ' ' +
  'prose-h1:my-0 prose-h2:my-0 prose-h3:my-0 prose-h4:my-0 prose-h5:my-0 prose-h6:my-0' +
  ' ' +
  'prose-h1:text-primary prose-h2:text-primary prose-h3:text-primary prose-h4:text-primary prose-h5:text-primary prose-h6:text-primary' +
  ' ' +
  'prose-pre:bg-gray-100 prose-pre:border prose-pre:border-gray-200 prose-pre:rounded-md prose-pre:text-gray-900' +
  ' ' +
  'prose-a:text-brand-700' +
  ' ' +
  'prose-p:break-words prose-p:mt-0 prose-p:mb-0';
