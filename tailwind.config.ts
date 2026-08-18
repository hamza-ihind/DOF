import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      colors: {
        dof: {
          blue: '#0a4f6c',
          'blue-dark': '#06354a',
          'blue-light': '#136e96',
          red: '#aa1c34',
          'red-dark': '#7d1224',
          'red-light': '#d42743',
          sand: '#f8f6f0',
          gold: '#dfa234',
          slate: '#1e293b'
        }
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, rgba(10, 79, 108, 0.95) 0%, rgba(6, 53, 74, 0.9) 100%)',
        'accent-gradient': 'linear-gradient(135deg, #0a4f6c 0%, #aa1c34 100%)',
      }
    },
  },
  plugins: [],
};

export default config;
