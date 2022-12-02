import {PropsWithChildren} from 'react';
import {Header} from '../Header/Header';

export default function AppLayout({children}: PropsWithChildren) {
  return (
    <div>
      <Header />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-6">
        {children}
      </div>
    </div>
  );
}
