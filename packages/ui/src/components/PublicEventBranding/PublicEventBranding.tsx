import Link from 'next/link';
import {getBaseUrl} from 'utils';
import {LogoView} from '../Logo/Logo';
import {useAuth} from '@clerk/nextjs';

export function PublicEventBranding() {
  const {userId} = useAuth();
  const url = getBaseUrl().endsWith('/') ? getBaseUrl() : `${getBaseUrl()}/`;

  if (userId) return null;

  return (
    <Link
      href={url}
      className={
        'flex flex-col items-center justify-center text-gray-500 text-sm lg:fixed right-4 bottom-4'
      }
    >
      <div className="flex items-center justify-center bg-gray-50 border-2 border-gray-800 pt-2 pb-3 px-1.5 rounded-t-md -mb-2">
        <span className="font-bold text-xs">Built with</span>{' '}
      </div>
      <LogoView />
    </Link>
  );
}
