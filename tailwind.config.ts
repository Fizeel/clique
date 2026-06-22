import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#FAFAF8',
        surface: '#FFFFFF',
        primary: {
          DEFAULT: '#8B5E52',
          dark: '#6D4840',
          light: '#C49890',
        },
        accent: {
          DEFAULT: '#C4A882',
          dark: '#A88A65',
          light: '#DEC9A9',
        },
        muted: {
          DEFAULT: '#78716C',
          light: '#A8A29E',
          dark: '#44403C',
        },
        border: '#EBE8E3',
        success: '#5E9E7E',
        danger: '#C0564B',
      },
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        serif: ['Playfair Display', ...defaultTheme.fontFamily.serif],
      },
      borderRadius: {
        xl: '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
    },
  },
  plugins: [],
}
export default config
