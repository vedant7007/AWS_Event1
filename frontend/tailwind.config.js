module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#0B0F14',
          surface: '#111827',
          elevated: '#1F2937',
          primary: '#7C3AED',
          border: '#1F2937',
          'text-primary': '#F9FAFB',
          'text-secondary': '#D1D5DB',
          'text-muted': '#9CA3AF',
        },
        // Keeping system colors as backups/utility
        success: '#10b981',
        danger: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6',
      },
      spacing: {
        '4': '4px',
        '8': '8px',
        '16': '16px',
        '24': '24px',
        '32': '32px',
        '48': '48px',
      },
      borderRadius: {
        'button': '10px',
        'card': '16px',
        'input': '10px',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'glow': '0 0 15px -3px rgba(124, 58, 237, 0.4)',
      }
    },
  },
  plugins: [],
}

