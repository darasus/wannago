import clsx from 'clsx';
import Link from 'next/link';
import {getBaseUrl} from '../../utils/getBaseUrl';
import {Logo} from '../Logo/Logo';

export function PublicEventBranding() {
  return (
    <Link
      href={getBaseUrl()}
      className={clsx(
        'flex items-center justify-center text-gray-500 px-3 py-1 rounded-full text-sm'
      )}
    >
      <span className="mr-2 font-bold">Built with</span>{' '}
      <Logo href={getBaseUrl()} />
    </Link>
  );
}
