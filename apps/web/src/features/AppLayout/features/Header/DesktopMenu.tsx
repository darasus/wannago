import {Button} from 'ui';
import {navItems} from './constants';

export function DesktopMenu() {
  return (
    <div className="hidden md:flex gap-x-5 md:gap-x-4">
      {navItems.map((item, i) => (
        <Button as="a" href={item.href} key={i} variant="neutral" size="sm">
          {item.label}
        </Button>
      ))}
    </div>
  );
}
