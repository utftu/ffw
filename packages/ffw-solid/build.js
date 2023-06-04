import {build, defineConfig} from 'vite';

await build({
  ...defineConfig({
    build: {
      outDir: './dist',
      lib: {
        entry: ['./src/ffw-solid.js'],
        formats: ['es', 'cjs'],
      },
      rollupOptions: {
        external: ['ffw', 'solid-js'],
      },
    },
  }),
});
