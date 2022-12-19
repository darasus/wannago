import {PropsWithChildren} from 'react';
import {Header} from '../Header/Header';

export default function AppLayout({children}: PropsWithChildren) {
  return (
    <div>
      <div className="relative z-10">
        <Header />
      </div>
      <div className="relative">
        <div>{children}</div>
      </div>
    </div>
  );
}