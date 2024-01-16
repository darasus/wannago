import {Text, Container} from 'ui';
import {legalNavItems} from 'const';
import Link from 'next/link';
import {getConfig} from 'utils';

export function Footer() {
  return (
    <footer>
      <Container className="my-0 m-auto">
        <div className="flex justify-center flex-wrap gap-4 text-xs text-muted-foreground">
          <Text>
            {getConfig().name} {new Date().getFullYear()}
          </Text>
          {[
            ...legalNavItems,
            getConfig().twitterLink
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
