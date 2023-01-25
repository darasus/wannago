import {Img} from '@react-email/img';
import {Section} from '@react-email/section';
import {Text as _Text} from '@react-email/text';
import {Link as _Link} from '@react-email/link';
import {Button as _Button} from '@react-email/button';
import React, {PropsWithChildren} from 'react';

interface TitleProps extends PropsWithChildren {}

export function Title({children}: TitleProps) {
  return <_Text style={title}>{children}</_Text>;
}

interface TextProps extends PropsWithChildren {
  style?: React.CSSProperties;
}

export function Text({children, style}: TextProps) {
  return <_Text style={{...text, ...style}}>{children}</_Text>;
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
    <_Link
      href={href}
      style={{
        fontFamily,
        color: token.dark,
        textDecoration: 'underline',
      }}
    >
      {children}
    </_Link>
  );
}

interface ButtonProps extends PropsWithChildren {
  href: string;
}

export function Button({children, href}: ButtonProps) {
  return (
    <_Button
      style={{
        fontFamily,
        borderRadius: '100px',
        color: token.dark,
        fontSize: '15px',
        fontWeight: 'bold',
        textDecoration: 'none',
        textAlign: 'center' as const,
        display: 'block',
        padding: '15px 25px',
        borderWidth: '1px',
        borderColor: token.dark,
        borderStyle: 'solid',
        backgroundColor: token.brand,
      }}
      href={href}
    >
      {children}
    </_Button>
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
  dark: 'rgb(30, 41, 59)',
  brand: 'rgb(216, 226, 220)',
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
  color: token.dark,
  padding: '17px 0 0',
  fontWeight: 'bold',
};

export const text = {
  fontFamily,
  fontSize: '15px',
  lineHeight: '1.4',
  color: token.dark,
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
