/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        neon: {
          50: '#e7fff2',
          100: '#b9ffd9',
          200: '#7dffbb',
          300: '#39f79b',
          400: '#00e87d',
          500: '#00c964',
          600: '#00a152',
          700: '#007b3f',
          800: '#00562c',
          900: '#003018',
        },
        cyber: {
          bg: '#05090c',
          panel: '#0b1117',
          panel2: '#111821',
          border: '#1e2a36',
          text: '#c8d3dc',
          muted: '#6b7d8a',
        },
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'monospace'],
      },
      boxShadow: {
        neon: '0 0 12px rgba(0, 232, 125, 0.45), 0 0 32px rgba(0, 232, 125, 0.15)',
      },
    },
  },
  plugins: [],
};
