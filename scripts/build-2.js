import {build, defineConfig} from 'vite';

const packages = [
  {
    name: 'ffw',
    entry: './packages/ffw/src/index.js',
  },
];

for (const {name, entry} of packages) {
  await build({
    ...defineConfig({
      build: {
        target: 'esnext',
        outDir: `./dist/${name}`,
        name,
        lib: {
          fileName: name,
          entry: [entry],
          formats: ['es', 'cjs'],
        },
        rollupOptions: {
          external: ['yup'],
        },
      },
    }),
  });
}
