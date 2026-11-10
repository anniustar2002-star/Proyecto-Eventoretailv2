import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// base './' para que funcione al cargarse desde file:// dentro de Electron
export default defineConfig({
  base: './',
  plugins: [react()],
  test: { environment: 'node' },
});
