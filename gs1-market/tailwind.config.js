import plugin from 'tailwindcss/plugin';

/** Tokens GS1 tomados de la maqueta de Stitch y de DESIGN.md */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      // Para TV de 50": ningún texto por debajo de 18 px
      fontSize: { xs: ['1.125rem', { lineHeight: '1.5rem' }], sm: ['1.125rem', { lineHeight: '1.6rem' }] },
      colors: {
        'gs1-blue': '#002C6C',
        'gs1-orange': '#F26334',
        'gs1-fuchsia': '#F05587',
        'gs1-green': '#7AC143',
        'gs1-purple': '#8A2BE2',
        'gs1-gold': '#C4B000',
        surface: '#FFFFFF',
        'surface-low': '#F8FAFC',
        'surface-mid': '#F1F5F9',
        'on-surface': '#0F172A',
        'on-surface-variant': '#475569',
        outline: '#94A3B8',
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      keyframes: {
        laserMove: { '0%, 100%': { top: '8%' }, '50%': { top: '88%' } },
        pulseGlow: {
          '0%, 100%': { opacity: '0.12', transform: 'scale(1)' },
          '50%': { opacity: '0.22', transform: 'scale(1.05)' },
        },
      },
      animation: {
        laser: 'laserMove 2.2s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
      },
    },
  },
  plugins: [
    // Variante `portrait:` para la pantalla en vertical (el Stage pone data-orientation)
    plugin(({ addVariant }) => addVariant('portrait', '[data-orientation="portrait"] &')),
  ],
};
