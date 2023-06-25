'use client';

import {CheckCircleIcon, XCircleIcon} from '@heroicons/react/24/solid';
import {ToastBar, Toaster} from 'react-hot-toast';
import {cn} from 'utils';

export function ToastProvider() {
  return (
    <Toaster
      toastOptions={{
        duration: 5000,
      }}
    >
      {t => (
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
                'p-4 flex items-center max-w-md w-full border-2 border-gray-800 bg-white rounded-3xl'
              )}
              data-testid={
                t.type === 'success' ? 'toast-success' : 'toast-success'
              }
            >
              <div
                className={cn(
                  'flex justify-center items-center shrink-0 h-7 w-7 rounded-full mr-2 border',
                  {
                    'bg-green-600 border-green-700': t.type === 'success',
                    'bg-red-600 border-red-700': t.type === 'error',
                  }
                )}
              >
                {t.type === 'success' && (
                  <CheckCircleIcon
                    className="h-6 w-6 m-0 text-gray-50"
                    style={{marginRight: 0}}
                  />
                )}
                {t.type === 'error' && (
                  <XCircleIcon
                    className="h-6 w-6 m-0 text-gray-50"
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
