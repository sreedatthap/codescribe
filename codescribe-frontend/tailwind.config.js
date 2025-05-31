/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
    theme: {
      extend: {
        fontFamily: {
          mono: ['JetBrains Mono', 'monospace'],
        },
        colors: {
          'dark-gray': '#1F2937',     // Extra contrast dark gray
          'custom-black': '#000000',  // True black
          'light-gray': '#D1D5DB',    // For subtle highlights
        },
        boxShadow: {
          '3d': '0 10px 30px rgba(0, 0, 0, 0.25), 0 4px 10px rgba(0, 0, 0, 0.1)',
          'inner': 'inset 0 4px 10px rgba(0, 0, 0, 0.3)',
          'neon': '0 0 20px rgba(128, 90, 213, 0.6), 0 0 30px rgba(99, 102, 241, 0.4)',
        },
        spacing: {
          128: '32rem',
          144: '36rem',
        },
        borderRadius: {
          '4xl': '2rem',
        },
        backdropBlur: {
          xs: '2px',
        },
        backgroundImage: {
          'gradient-dark': 'linear-gradient(to bottom right, #111827, #1F2937, #000000)',
        },
      },
    },
    plugins: [],
  };
  