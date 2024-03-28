/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-text': '#13040c',
        'custom-background': '#fcf0f7',
        'custom-primary': '#d72f8f',
        'custom-secondary': '#92eac4',
        'custom-accent': '#588bde',
      },
    },
  },
  plugins: [],
};
