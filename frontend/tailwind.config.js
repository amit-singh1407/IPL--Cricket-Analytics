/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Manrope"', 'sans-serif'],
      },
      colors: {
        court: {
          50: '#f5fbff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        pitch: {
          50: '#f7ffe8',
          100: '#ecffd0',
          200: '#d7ff9f',
          300: '#b7ff5a',
          400: '#92f424',
          500: '#70d312',
          600: '#56b309',
          700: '#438709',
          800: '#376b0d',
          900: '#305b10',
        },
      },
      boxShadow: {
        glow: '0 24px 64px -20px rgba(56, 189, 248, 0.45)',
        soft: '0 20px 45px -20px rgba(15, 23, 42, 0.45)',
      },
      backgroundImage: {
        hero: 'linear-gradient(135deg, rgba(2, 132, 199, 0.92), rgba(14, 165, 233, 0.76) 45%, rgba(15, 23, 42, 0.92) 100%)',
        mesh: 'radial-gradient(circle at top left, rgba(56, 189, 248, 0.22), transparent 32%), radial-gradient(circle at top right, rgba(20, 184, 166, 0.18), transparent 28%), radial-gradient(circle at bottom, rgba(250, 204, 21, 0.14), transparent 30%)',
      },
      keyframes: {
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        floatSlow: 'floatSlow 8s ease-in-out infinite',
        fadeUp: 'fadeUp 0.5s ease-out both',
      },
    },
  },
  plugins: [],
};
