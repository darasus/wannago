import {Text, Logo, Container, Button} from 'ui';
import {
  legalNavItems,
  navItems,
} from '../../features/AppLayout/features/Header/constants';

export function Footer() {
  return (
    <footer className="bg-white">
      <Container className="my-0 m-auto">
        <div className="flex flex-col gap-8 py-8">
          <div className="flex justify-center">
            <Logo href="/" />
          </div>
          <div className="flex justify-center flex-wrap gap-4">
            {[
              ...navItems,
              ...legalNavItems,
              {label: 'Twitter', href: 'https://twitter.com/wannagohq'},
            ].map(({href, label}) => {
              return (
                <Button
                  key={href}
                  href={href}
                  variant="link-gray"
                  size="sm"
                  as="a"
                >
                  {label}
                </Button>
              );
            })}
          </div>
          <div className="flex justify-center">
            <Text>WannaGo &copy; {new Date().getFullYear()}</Text>
          </div>
        </div>
      </Container>
    </footer>
  );
}
