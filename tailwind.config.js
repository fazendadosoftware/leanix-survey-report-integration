const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        sans: ['Axiforma-Regular', ...defaultTheme.fontFamily.sans],
        'axiforma-bold': ['Axiforma-Bold', ...defaultTheme.fontFamily.sans]
      },
      fontSize: {
        tiny: '0.7rem'
      },
      borderRadius: {
        DEFAULT: '3px'
      },
      colors: {
        leanix: {
          blue: '#1666ee',
          'dark-blue': '#1259d4',
          'darkest-blue': '#104cb2'
        }
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: [
    require('@tailwindcss/forms')
  ]
}
