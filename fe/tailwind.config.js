/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './shared/**/*.{js,ts,jsx,tsx,mdx}',
    './features/**/*.{js,ts,jsx,tsx,mdx}',
    './core/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // University branding colors
        'green-dark': '#1a4a1a',
        'green-main': '#2d7a2d', 
        'green-light': '#4caf50',
        'green-pale': '#e8f5e9',
        'gold': '#c9a227',
        'gold-light': '#f0c040',
        'topbar-bg': '#1a3a1a',
        'topbar-text': '#cde8cd',
        'topbar-icon': '#8bc88b',
        'gray-light': '#f5f5f5',
        'gray-mid': '#e0e0e0',
        'text-dark': '#1a1a1a',
        'text-mid': '#444444',
        'text-light': '#777777',
      },
      fontFamily: {
        'vietnam': ['"Be Vietnam Pro"', 'sans-serif'],
        'serif': ['"Playfair Display"', 'serif'],
      },
      spacing: {
        '15': '3.75rem',
        '70': '17.5rem',
      },
      borderWidth: {
        '1.5': '1.5px',
        '3': '3px',
        '5': '5px',
      },
      height: {
        '50': '12.5rem',
      },
      fontSize: {
        '7xl': '4.5rem',
      },
      letterSpacing: {
        'widest': '0.2em',
      }
    },
  },
  plugins: [],
}