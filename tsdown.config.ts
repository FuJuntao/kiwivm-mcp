import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts'],
  outDir: 'dist',
  format: ['esm'],
  dts: { sourcemap: true },
  deps: { onlyBundle: false },
  sourcemap: true,
  clean: true,
});
