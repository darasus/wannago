import {Inter, Fira_Code, Inter_Tight} from 'next/font/google';

export const textFont = Inter({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-default',
  subsets: ['latin'],
});

export const codeFont = Fira_Code({
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-code',
  subsets: ['latin'],
});

export const shortcutFont = Inter_Tight({
  weight: ['500'],
  variable: '--font-shortcut',
  subsets: ['latin'],
});
