'use client';

import dynamic from 'next/dynamic';
import {cn} from 'utils';

const Toaster = dynamic(
  () => import('react-hot-toast').then((c) => c.Toaster),
  {
    ssr: false,
  }
);

const ToastBar = dynamic(
  () => import('react-hot-toast').then((c) => c.ToastBar),
  {
    ssr: false,
  }
);

const CheckmarkIcon = dynamic(
  () => import('react-hot-toast').then((c) => c.CheckmarkIcon),
  {
    ssr: false,
  }
);
const ErrorIcon = dynamic(
  () => import('react-hot-toast').then((c) => c.ErrorIcon),
  {
    ssr: false,
  }
);
const LoaderIcon = dynamic(
  () => import('react-hot-toast').then((c) => c.LoaderIcon),
  {
    ssr: false,
  }
);

export function ToastProvider() {
  return (
    <Toaster
      toastOptions={{
        duration: 5000,
      }}
    >
      {(t) => (
        <ToastBar
          toast={t}
          style={{
            padding: 0,
            backgroundColor: 'transparent',
            boxShadow: 'none',
          }}
        >
          {({message}) => (
            <div
              className={cn(
                'p-4 flex items-center max-w-md w-full border-2 border-gray-800 bg-white rounded-md'
              )}
              data-testid={
                t.type === 'success' ? 'toast-success' : 'toast-success'
              }
            >
              <div
                className={cn(
                  'flex justify-center items-center shrink-0 rounded-full mr-2'
                )}
              >
                {t.type === 'success' && (
                  <CheckmarkIcon
                    className="h-6 w-6 m-0 text-gray-50 bg-green-400"
                    style={{marginRight: 0}}
                  />
                )}
                {t.type === 'error' && (
                  <ErrorIcon
                    className="h-6 w-6 m-0 text-gray-50 bg-red-400"
                    style={{marginRight: 0}}
                  />
                )}
                {t.type === 'loading' && (
                  <LoaderIcon
                    className="h-6 w-6 m-0 text-gray-50 bg-gray-400"
                    style={{marginRight: 0}}
                  />
                )}
              </div>
              <div className="leading-snug">{message}</div>
            </div>
          )}
        </ToastBar>
      )}
    </Toaster>
  );
}
