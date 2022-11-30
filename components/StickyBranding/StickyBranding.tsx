import clsx from 'clsx';
import Link from 'next/link';
import {logoFont} from '../../fonts';
import {getBaseUrl} from '../../utils/getBaseUrl';

export function StickyBranding() {
  return (
    <Link
      href={getBaseUrl()}
      className={clsx(
        'fixed bottom-1 right-1 bg-brand-700 border border-brand-800 text-gray-100 px-2 py-1 rounded-md text-sm'
      )}
    >
      Built with{' '}
      <span className={clsx(logoFont.className, 'text-gray-100')}>WannaGo</span>
    </Link>
  );
}
