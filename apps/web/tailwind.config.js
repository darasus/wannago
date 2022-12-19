const forms = require('@tailwindcss/forms');
const typography = require('@tailwindcss/typography');
const lineClamp = require('@tailwindcss/line-clamp');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './hooks/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          100: `#FEC5BB`,
          200: `#FCD5CE`,
          300: `#FAE1DD`,
          400: `#F8EDEB`,
          500: `#E8E8E4`,
          600: `#D8E2DC`,
          700: `#ECE4DB`,
          800: `#FFE5D9`,
          900: `#FFD7BA`,
          1000: `#FEC89A`,
        },
      },
      height: {
        'hero-preview': 600,
      },
      transitionTimingFunction: {
        'in-expo': 'cubic-bezier(.47,1.64,.41,.8)',
      },
    },
  },
  plugins: [lineClamp, forms, typography],
  future: {
    hoverOnlyWhenSupported: true,
  },
};
