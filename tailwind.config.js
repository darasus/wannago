const forms = require('@tailwindcss/forms');
const typography = require('@tailwindcss/typography');
const lineClamp = require('@tailwindcss/line-clamp');
// const aspectRatio = require('@tailwindcss/aspect-ratio');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          100: '#caf0f8ff',
          200: '#ade8f4ff',
          300: '#90e0efff ',
          400: '#48cae4ff',
          500: '#00b4d8ff',
          600: '#0096c7ff',
          700: '#0077b6ff',
          800: '#023e8aff',
          900: '#03045eff',
        },
      },
    },
  },
  plugins: [lineClamp, forms, typography],
  future: {
    hoverOnlyWhenSupported: true,
  },
};
