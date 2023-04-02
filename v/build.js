import {build} from 'vite';
await build({
  build: {
    target: 'esnext',
    outDir: `./dist`,
    lib: {
      fileName: '',
      entry: ['./a.js'],
      formats: ['es', 'cjs'],
    },
  },
});
