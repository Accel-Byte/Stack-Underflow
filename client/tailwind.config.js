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
        'primary-light': '#393e46',
        'nav-link-hover-dark': '#afffdf',
        'nav-link-hover-light': '#8167a9',
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
