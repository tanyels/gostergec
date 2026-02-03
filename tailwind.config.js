/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Göstergeç brand colors
        gold: {
          50: '#fffbeb',
          100: '#fef3c7',
          500: '#f59e0b',
          600: '#d97706',
        },
        profit: '#10b981',  // green for gains
        loss: '#ef4444',    // red for losses
      },
    },
  },
  plugins: [],
}
