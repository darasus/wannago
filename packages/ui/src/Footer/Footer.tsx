import {config} from 'config';
import {legalNavItems} from 'const';
import Link from 'next/link';

import {Container} from '../Container/Container';
import {Text} from '../Text/Text';

export function Footer() {
  return (
    <footer className="p-2">
      <Container className="my-0 m-auto">
        <div className="flex justify-center flex-wrap gap-4 text-xs text-muted-foreground">
          <Text>
            {config.name} {new Date().getFullYear()}
          </Text>
          {[
            ...legalNavItems,
            config.twitterLink
              ? {label: 'Twitter', href: 'https://twitter.com/wannagohq'}
              : undefined,
          ]
            .filter(Boolean)
            .map((item) => {
              if (!item) {
                return null;
              }
              const {label, href} = item;
              return (
                <Link href={href} className="underline">
                  {label}
                </Link>
              );
            })}
        </div>
      </Container>
    </footer>
  );
}
