import {
  Paytone_One as LogoFont,
  Inter as BodyFont,
  DM_Serif_Display as TitleFont,
} from '@next/font/google';

export const logoFont = LogoFont({
  weight: '400',
  display: 'swap',
});

export const bodyFont = BodyFont({
  weight: ['100', '200', '300', '400', '500', '700', '800', '900'],
  display: 'swap',
  subsets: ['latin'],
});

export const titleFont = TitleFont({
  weight: ['400'],
  display: 'swap',
  subsets: ['latin'],
});

export const titleFontClassName = titleFont.className;
