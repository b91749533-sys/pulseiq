/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: {
          light: '#f9fafb',
          dark: '#09090b', // Almost Black
        },
        card: {
          light: '#ffffff',
          dark: '#18181b', // Deep Charcoal
        },
        surface: {
          light: '#f3f4f6',
          dark: '#111827', // Dark Blue-Gray
        },
        border: {
          light: '#e5e7eb',
          dark: '#27272a', // Subtle gray borders
        },
        brand: {
          primary: '#0b1020',    // Deep Space
          electric: '#4f8cff',   // Electric Blue
          violet: '#7a5cfa',     // Violet Accent
          emerald: '#24c08e',    // Success Emerald
          amber: '#ffb84d',      // Warning Amber
          coral: '#ff5d73',      // Error Coral
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'premium-light': '0 4px 20px -2px rgba(9, 9, 11, 0.04), 0 2px 10px -1px rgba(9, 9, 11, 0.02)',
        'premium-dark': '0 10px 40px -10px rgba(0, 0, 0, 0.7), 0 2px 20px -5px rgba(0, 0, 0, 0.4)',
        'glow-electric': '0 0 25px 2px rgba(79, 140, 255, 0.15)',
        'glow-violet': '0 0 25px 2px rgba(122, 92, 250, 0.15)',
      },
      animation: {
        'fade-in': 'fadeIn 0.25s ease-out forwards',
        'slide-up': 'slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-slow': 'pulse 3.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scale-in': 'scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', filter: 'blur(4px)' },
          '100%': { opacity: '1', filter: 'blur(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.97)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
