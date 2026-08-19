/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // theme variables (overridden per-site via CSS vars in index.css)
        gold: 'rgb(var(--c-gold) / <alpha-value>)',
        'gold-muted': 'rgb(var(--c-gold-muted) / <alpha-value>)',
        sand: {
          900: 'rgb(var(--c-bg) / <alpha-value>)',
          800: 'rgb(var(--c-bg-soft) / <alpha-value>)',
        },
        ink: 'rgb(var(--c-ink) / <alpha-value>)',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
