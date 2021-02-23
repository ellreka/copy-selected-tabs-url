const theme = require('tailwindcss')

const colors = {
  primary: '#3E5171',
  secondary: '#F4C0D9',
  black: '#333333'
}

module.exports = {
  ...require('@ellreka/configs/tailwind.config.js'),
  purge: ['./src/popup.tsx'],
  theme: {
    extend: {
      backgroundColor: colors,
      borderColor: colors,
      textColor: colors,
      width: {
        'screen-sm': '640px'
      },
      minWidth: {
        ...theme.spacing
      }
    }
  },
  variants: {
    extend: {
      borderWidth: ['hover', 'focus'],
      opacity: ['disabled'],
      pointerEvents: ['disabled'],
      cursor: ['disabled']
    }
  }
}
