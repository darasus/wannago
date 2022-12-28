import Image from 'next/image';
import Link from 'next/link';
import {Button} from '../Button/Button';
import {Container} from '../Container/Container';
import {navItems} from '../Header/Header';
import {Logo} from '../Logo/Logo';
import {Text} from '../Text/Text';

export function Footer() {
  return (
    <footer>
      <Container className="m-0 my-0">
        <div className="flex items-center py-4">
          <Logo href="/" />
          <div className="grow" />
          <div className="-my-1 flex justify-center gap-x-4">
            {navItems.map(({href, label}) => {
              return (
                <Button
                  key={href}
                  href={href}
                  variant="neutral"
                  size="sm"
                  as="a"
                >
                  {label}
                </Button>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col items-center py-4 sm:flex-row-reverse sm:justify-between">
          <div className="flex gap-x-6">
            <Link href="https://twitter.com/wannagohq">
              <svg className="h-6 w-6 fill-slate-800 group-hover:fill-slate-700">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0 0 22 5.92a8.19 8.19 0 0 1-2.357.646 4.118 4.118 0 0 0 1.804-2.27 8.224 8.224 0 0 1-2.605.996 4.107 4.107 0 0 0-6.993 3.743 11.65 11.65 0 0 1-8.457-4.287 4.106 4.106 0 0 0 1.27 5.477A4.073 4.073 0 0 1 2.8 9.713v.052a4.105 4.105 0 0 0 3.292 4.022 4.093 4.093 0 0 1-1.853.07 4.108 4.108 0 0 0 3.834 2.85A8.233 8.233 0 0 1 2 18.407a11.615 11.615 0 0 0 6.29 1.84" />
              </svg>
            </Link>
          </div>
          <Text className="mt-6 text-sm sm:mt-0 font-bold">
            WannaGo &copy; {new Date().getFullYear()} ·{' '}
            <span className="font-medium">
              Designed and developed in Amsterdam{' '}
              <Image
                className="inline-block"
                src="/images/amsterdam.png"
                width={20}
                height={20}
                alt="amsterdam flag"
              />
            </span>
          </Text>
        </div>
      </Container>
    </footer>
  );
}
