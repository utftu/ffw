import {build, defineConfig} from 'vite';
import dts from 'vite-plugin-dts';

await build({
  ...defineConfig({
    build: {
      outDir: './dist',
      lib: {
        entry: ['./src/ffw-solid.ts'],
        formats: ['es'],
      },
      rollupOptions: {
        external: ['ffw', 'solid-js'],
      },
    },
  }),
  plugins: [
    dts({
      outDir: './dist/types',
      tsconfigPath: './tsconfig.types.json',
    }),
  ],
});
