import {build, defineConfig} from 'vite';
import dts from 'vite-plugin-dts';

await build({
  ...defineConfig({
    build: {
      outDir: './dist',
      lib: {
        entry: ['./src/ffw-react.ts'],
        formats: ['es'],
      },
      rollupOptions: {
        external: ['ffw', 'react'],
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
