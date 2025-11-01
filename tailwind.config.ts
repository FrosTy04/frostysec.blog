import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#000',
            a: {
              color: '#000',
              textDecoration: 'underline',
              '&:hover': {
                opacity: 0.7,
              },
            },
          },
        },
      },
    },
  },
  plugins: [],
}
export default config

