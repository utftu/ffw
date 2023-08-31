import {build, defineConfig} from 'vite';
import dts from 'vite-plugin-dts';

await build({
  ...defineConfig({
    build: {
      outDir: './dist',
      lib: {
        entry: ['./src/ffw-svelte.js'],
        formats: ['es', 'cjs'],
      },
      rollupOptions: {
        external: ['ffw', 'svelte'],
      },
    },
  }),
  plugins: [dts()],
});
