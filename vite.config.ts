import linaria from '@linaria/vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { defineConfig } from 'vite';
import banner from 'vite-plugin-banner';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
import dts from 'vite-plugin-dts';
import nodePolyfills from 'vite-plugin-node-stdlib-browser';

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills(),
    dts({
      insertTypesEntry: true,
      exclude: ['**/node_modules/**', '**/dist/**'],
      skipDiagnostics: true, // Skip emitting TypeScript diagnostics
    }),
    linaria({
      include: ['**/*.{ts,tsx}'],
      babelOptions: {
        presets: ['@babel/preset-typescript', '@babel/preset-react'],
        plugins: ['@babel/plugin-transform-modules-commonjs'],
      },
    }),
    cssInjectedByJsPlugin(),
    banner({
      content: '"use client";',
      verify: false,
    }),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src'),
      name: 'ao-wallet-kit',
      formats: ['es', 'umd'],
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
});
