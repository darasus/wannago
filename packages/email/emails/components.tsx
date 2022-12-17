import {Img} from '@react-email/img';
import {Section} from '@react-email/section';
import {Text as REText} from '@react-email/text';
import {Link as RELink} from '@react-email/link';
import {Button as REButton} from '@react-email/button';
import {PropsWithChildren} from 'react';

interface TitleProps extends PropsWithChildren {}

export function Title({children}: TitleProps) {
  return <REText style={title}>{children}</REText>;
}

interface TextProps extends PropsWithChildren {}

export function Text({children}: TextProps) {
  return <REText style={text}>{children}</REText>;
}

export function Logo() {
  const ratio = 233 / 121;
  const height = 50;
  const width = height * ratio;

  return (
    <Img
      src="https://www.wannago.app/images/logo_dark.png"
      alt="WannaGo logo"
      width={width}
      height={height}
    />
  );
}

export function Header() {
  return (
    <Section>
      <Logo />
    </Section>
  );
}

interface LinkProps extends PropsWithChildren {
  href: string;
}

export function Link({children, href}: LinkProps) {
  return (
    <RELink
      href={href}
      style={{
        fontFamily,
        color: token.color.brand,
        textDecoration: 'underline',
      }}
    >
      {children}
    </RELink>
  );
}

interface ButtonProps extends PropsWithChildren {
  href: string;
}

export function Button({children, href}: ButtonProps) {
  return (
    <REButton
      style={{
        fontFamily,
        backgroundColor: token.color.brand,
        borderRadius: '7px',
        fontWeight: '600',
        color: '#ffffff',
        fontSize: '15px',
        textDecoration: 'none',
        textAlign: 'center' as const,
        display: 'block',
        padding: '15px 15px',
      }}
      href={href}
    >
      {children}
    </REButton>
  );
}

export function Footer() {
  return (
    <div style={{textAlign: 'center', marginTop: gutter}}>
      <Text>Powered by WannaGo</Text>
      <Text>
        <Link href="https://www.wannago.app">Website</Link> •{' '}
        <Link href="https://twitter.com/wannagohq">Twitter</Link>
      </Text>
    </div>
  );
}

interface ImageProps {
  imageSrc: string;
  alt?: string;
}

export function Image({imageSrc, alt}: ImageProps) {
  return (
    <Section
      style={{
        borderRadius: '20px',
        overflow: 'hidden',
        marginBottom: gutter,
      }}
    >
      <Img src={imageSrc} alt={alt} style={{display: 'block', width: '100%'}} />
    </Section>
  );
}

// TODO: fix design token
const token = {
  textColor: '#1f2937',
  buttonColor: '#05fecc',
  color: {
    brand: '#0033FF',
  },
};

export const gutter = 20;

export const logo = {
  borderRadius: 21,
  width: 42,
  height: 42,
};

export const fontFamily =
  '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif';

export const main = {
  backgroundColor: '#ffffff',
};

export const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  width: '560px',
};

export const title = {
  fontFamily,
  fontSize: '24px',
  letterSpacing: '-0.5px',
  lineHeight: '1.3',
  color: token.textColor,
  padding: '17px 0 0',
  fontWeight: 'bold',
};

export const text = {
  fontFamily,
  fontSize: '15px',
  lineHeight: '1.4',
  color: token.textColor,
  margin: 0,
};

export const buttonContainer = {
  margin: '20px 0',
};

export const hr = {
  borderColor: '#dfe1e4',
  margin: '30px 0',
};

export const code = {
  fontFamily: 'monospace',
  fontWeight: '700',
  padding: '1px 4px',
  backgroundColor: '#dfe1e4',
  letterSpacing: '-0.3px',
  fontSize: '21px',
  borderRadius: '4px',
  color: '#3c4149',
};
