import {build, defineConfig} from 'vite';

await build({
  ...defineConfig({
    build: {
      outDir: './dist',
      lib: {
        entry: ['./src/ffw-react.js'],
        formats: ['es', 'cjs'],
      },
      rollupOptions: {
        external: ['ffw', 'react'],
      },
    },
  }),
});


// hello world