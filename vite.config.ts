import { sync } from 'glob';
import path from 'node:path';
import preserveDirectives from 'rollup-plugin-preserve-directives';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    dts({
      outDir: 'dist',
      tsconfigPath: './tsconfig.json',
      insertTypesEntry: true,
    }),
    preserveDirectives(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      external: ['zod'],
      preserveEntrySignatures: 'exports-only',
      output: {
        dir: 'dist',
        format: 'es',
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        preserveModules: true,
        preserveModulesRoot: 'src',
      },
      input: sync('src/**/*.ts', {
        ignore: ['src/**/*.d.ts'],
      }).reduce((entries, file) => {
        const entry = path.relative('src', file).replace(/\.[^/.]+$/, '');
        const newEntries = entries;
        newEntries[entry] = path.resolve(__dirname, file);
        return entries;
      }, {}),
    },
  },
});
