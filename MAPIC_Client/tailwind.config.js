/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Doraemon Color Palette
        cream: '#FFF8E7',
        matchaGreen: '#C8E6C9',
        babyBlue: '#BBDEFB',
        lightLavender: '#E1BEE7',
        doraemonBlue: '#00A0E9',
        doraemonRed: '#FF6B6B',
        doraemonYellow: '#FFD93D',
        
        // Neutral colors
        background: '#FAFAFA',
        surface: '#FFFFFF',
        text: {
          primary: '#2C2C2C',
          secondary: '#757575',
          disabled: '#BDBDBD',
        },
      },
      fontWeight: {
        thin: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
    },
  },
  plugins: [],
}

