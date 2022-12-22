import Link from 'next/link';
import {getBaseUrl} from '../../utils/getBaseUrl';
import {LogoView} from '../Logo/Logo';

export function PublicEventBranding() {
  return (
    <Link
      href={getBaseUrl()}
      className={
        'flex items-center justify-center text-gray-500 rounded-lg text-sm'
      }
    >
      <div className="flex items-center justify-center px-2 ">
        <span className="font-bold text-xs text-gray-800">Built with</span>{' '}
      </div>
      <LogoView />
    </Link>
  );
}
