import clsx from 'clsx';
import Link from 'next/link';
import {logoFont} from '../../fonts';
import {getBaseUrl} from '../../utils/getBaseUrl';

export function StickyBranding() {
  return (
    <Link
      href={getBaseUrl()}
      className={clsx(
        'fixed bottom-4 right-4 bg-brand-700 border border-brand-800 text-gray-100 px-3 py-1 rounded-full text-sm'
      )}
    >
      Built with{' '}
      <span className={clsx(logoFont.className, 'text-gray-100')}>WannaGo</span>
    </Link>
  );
}
