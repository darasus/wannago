const forms = require('@tailwindcss/forms');
// const typography = require('@tailwindcss/typography');
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
    extend: {},
  },
  plugins: [lineClamp, forms],
};
