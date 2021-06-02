module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    boxShadow: {
      'nav-shadow': '0 10px 30px 0 rgba(138, 155, 165, 0.15)',
    },
    extend: {
      colors: {
        'dark-logo': '#fff5a5',
        'primary-light': '#1F1D2B',
        'nav-link-hover-dark': '#afffdf',
        'nav-link-hover-light': '#8167a9',
        
        'card-dark': '#252836',
        'card-purple-dark': '#6A5CCC',
        'card-green-dark': '#22B07D',
        'card-red-dark': '#EA5F5F',
        'card-orange-dark': '#F19953',
        'card-blue-dark': '#2EAFF8',
        'card-pink-dark': '#ff449f',
      },
      borderStyle: ['hover'],
      fontFamily: {
        poppins: 'Poppins',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
