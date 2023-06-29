const forms = require("@tailwindcss/forms");
const typography = require("@tailwindcss/typography");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
    "../../packages/cards/src/**/*.{js,ts,jsx,tsx}",
    "../../packages/card-features/src/**/*.{js,ts,jsx,tsx}",
    "../../packages/auth-features/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      height: {
        "hero-preview": 600,
      },
      transitionDelay: {
        0: "0ms",
        100: "100ms",
        200: "200ms",
        300: "300ms",
        400: "400ms",
        500: "500ms",
        600: "600ms",
      },
    },
  },
  plugins: [forms, typography],
  future: {
    hoverOnlyWhenSupported: true,
  },
};
