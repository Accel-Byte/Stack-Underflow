module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    boxShadow: {
      'nav-shadow': '0 10px 30px 0 rgba(138, 155, 165, 0.15)',
      'profile-card-shadow': '0px 10px 20px -10px rgba(0,0,0, 0.75)',
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
        'login-button-dark': '#18DEB7',
        'login-button-dark-hover': '#232931',
        'profile-card-dark': '#231E39',
        'profile-tag-background-dark': '#FEBB0B',
        'profile-button-dark': '#03BFCB',

        'comment-dark': '#343A40'
      },
      animation: {
        bounce200: 'bounce 10ms infinite 200ms',
        bounce400: 'bounce 10ms infinite 400ms',
        bounce1: 'bounceDelay 1.4s ease-in-out -.32s both',
        bounce2: 'bounceDelay 1.4s ease-in-out -.16s both',
        bounce3: 'bounceDelay 1.4s ease-in-out  both',
      },
      keyframes: {
        bounceDelay: {
          '0%,100%,80%': { transform: 'scale(0)' },
          '40%': { transform: 'scale(1)' },
        },
        rotation: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(359deg)' },
        },
        spinner: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      borderStyle: ['hover'],
      fontFamily: {
        poppins: 'Poppins',
        josefin: 'Josefin Sans',
      },
      height: {
        '37rem': '37rem',
      },
      width: {
        '99%': '99%',
        '27rem': '27rem',
        '25rem': '25rem',
      },
    },
  },
  variants: {
    extend: {
      opacity: ['disabled'],
    },
  },
  plugins: [],
};
