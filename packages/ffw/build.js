import {build, defineConfig} from 'vite';

await build({
  ...defineConfig({
    build: {
      outDir: './dist',
      lib: {
        entry: ['./src/ffw.js'],
        formats: ['es', 'cjs'],
      },
    },
  }),
});
