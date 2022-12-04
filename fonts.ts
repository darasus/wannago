import {Paytone_One as LogoFont, Inter as BodyFont} from '@next/font/google';

export const logoFont = LogoFont({
  weight: '400',
  display: 'swap',
});

export const bodyFont = BodyFont({
  weight: ['400', '700'],
  display: 'swap',
});