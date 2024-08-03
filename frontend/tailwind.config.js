module.exports = {
  purge: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1976d2', // Azul primário para Tailwind
        secondary: '#dc004e', // Vermelho secundário para Tailwind
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
