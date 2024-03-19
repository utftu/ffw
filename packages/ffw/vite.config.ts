import {defineConfig} from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    outDir: './dist',
    lib: {
      entry: ['./src/ffw.ts'],
      formats: ['es'],
    },
  },
  plugins: [
    dts({
      outDir: './dist/types',
      tsconfigPath: './tsconfig.types.json',
    }),
  ],
});
