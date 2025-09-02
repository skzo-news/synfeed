/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cyber: { bg: '#0b0f14', panel: '#0e1621', line: '#1b2533', neon: '#00e5ff', magenta: '#f81ce5', text: '#E6EDF3' }
      },
      fontFamily: { mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'] }
    }
  },
  darkMode: 'class',
  plugins: []
}
