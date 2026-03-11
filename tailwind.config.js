/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'status-excellent': {
          bg: '#dcfce7',
          text: '#166534',
          border: '#86efac',
        },
        'status-good': {
          bg: '#dbeafe',
          text: '#1e40af',
          border: '#93c5fd',
        },
        'status-warning': {
          bg: '#fef9c3',
          text: '#854d0e',
          border: '#fde047',
        },
        'status-loss': {
          bg: '#fee2e2',
          text: '#991b1b',
          border: '#fca5a5',
        },
      },
    },
  },
  plugins: [],
};
