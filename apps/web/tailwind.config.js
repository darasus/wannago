const forms = require('@tailwindcss/forms');
const typography = require('@tailwindcss/typography');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
    '../../packages/cards/src/**/*.{js,ts,jsx,tsx}',
    '../../packages/card-features/src/**/*.{js,ts,jsx,tsx}',
    '../../packages/auth-features/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          100: `#EA698B`,
          200: `#D55D92`,
          300: `#C05299`,
          400: `#AC46A1`,
          500: `#973AA8`,
          600: `#822FAF`,
          700: `#6D23B6`,
          800: `#6411AD`,
          900: `#571089`,
          1000: `#47126B`,
        },
      },
      height: {
        'hero-preview': 600,
      },
      transitionDelay: {
        0: '0ms',
        100: '100ms',
        200: '200ms',
        300: '300ms',
        400: '400ms',
        500: '500ms',
        600: '600ms',
      },
    },
  },
  plugins: [forms, typography],
  future: {
    hoverOnlyWhenSupported: true,
  },
};
