const forms = require('@tailwindcss/forms');
const typography = require('@tailwindcss/typography');
const lineClamp = require('@tailwindcss/line-clamp');
// const aspectRatio = require('@tailwindcss/aspect-ratio');

const token = {
  color: {
    brand: '#1116bb',
    brandDark: '#0c2210',
  },
};

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
        // brand: {
        //   // 100: `#00FFCC`,
        //   // 200: `#00E8D2`,
        //   // 300: `#00D2D7`,
        //   // 400: `#00BBDD`,
        //   // 500: `#00A4E3`,
        //   // 600: `#008EE8`,
        //   // 700: `#0077EE`,
        //   // 800: `#0060F4`,
        //   // 900: `#004AF9`,
        //   // 1000: `#0033FF`,
        //   100: `#FFFF3F`,
        //   200: `#EEEF20`,
        //   300: `#DDDF00`,
        //   400: `#D4D700`,
        //   500: `#BFD200`,
        //   600: `#AACC00`,
        //   700: `#80B918`,
        //   800: `#55A630`,
        //   900: `#2B9348`,
        //   1000: `#007F5F`,
        // },
        // 'brand-dark': {
        //   100: `${token.color.brandDark + '10'}`,
        //   200: `${token.color.brandDark + '20'}`,
        //   300: `${token.color.brandDark + '30'}`,
        //   400: `${token.color.brandDark + '40'}`,
        //   500: `${token.color.brandDark + '50'}`,
        //   600: `${token.color.brandDark + '60'}`,
        //   700: `${token.color.brandDark + '70'}`,
        //   800: `${token.color.brandDark + '80'}`,
        //   900: `${token.color.brandDark + '90'}`,
        //   1000: `${token.color.brandDark}`,
        // },
      },
      height: {
        'hero-preview': 600,
      },
    },
  },
  plugins: [lineClamp, forms, typography],
  future: {
    hoverOnlyWhenSupported: true,
  },
};
