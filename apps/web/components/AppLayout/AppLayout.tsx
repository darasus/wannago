import {PropsWithChildren} from 'react';
import {Header} from '../Header/Header';

export default function AppLayout({children}: PropsWithChildren) {
  return (
    <div>
      <div className="relative z-20">
        <Header />
      </div>
      <div>
        <div>{children}</div>
      </div>
    </div>
  );
}
