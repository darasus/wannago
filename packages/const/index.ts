export const REMINDER_PERIOD_IN_SECONDS = 60 * 60 * 3; // 3 hours
export const ONE_WEEK_IN_SECONDS = 60 * 60 * 24 * 7;

export const feeAmount = 50;
export const feePercent = 0.05;

export function getIsPublic(pathname: string) {
  if (pathname === '/') return true;

  return [
    '/examples',
    '/sign-in',
    '/sign-up',
    '/terms',
    '/#how-does-it-work',
    '/#features',
    '/#faq',
    '/#pricing',
  ].some((publicPathname) => pathname.startsWith(publicPathname));
}

export const legalNavItems = [
  {label: 'Terms of Service', href: '/terms-of-service'},
  {label: 'Privacy Policy', href: '/privacy-policy'},
  {label: 'Cookie Policy', href: '/cookie-policy'},
];

export const proseClassName =
  'prose dark:prose-invert' +
  ' ' +
  'prose-h1:text-gray-900 prose-h2:text-gray-900 prose-h3:text-gray-900 prose-h4:text-gray-900 prose-h5:text-gray-900 prose-h6:text-gray-900' +
  ' ' +
  'prose-h1:my-0 prose-h2:my-0 prose-h3:my-0 prose-h4:my-0 prose-h5:my-0 prose-h6:my-0' +
  ' ' +
  'prose-h1:text-primary prose-h2:text-primary prose-h3:text-primary prose-h4:text-primary prose-h5:text-primary prose-h6:text-primary' +
  ' ' +
  'prose-pre:bg-muted prose-pre:border prose-pre:dark:bg-white/[.04] prose-pre:text-card-foreground' +
  ' ' +
  'prose-a:text-brand-700' +
  ' ' +
  'prose-p:break-words prose-p:mt-0 prose-p:mb-0' +
  ' ' +
  'focus:outline-none' +
  ' ' +
  'w-full max-w-none';
