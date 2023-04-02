import {build, defineConfig} from 'vite';

class PackageConfig {
  constructor({name, external}) {
    this.name = name;
    this.external = external;
  }

  get dir() {
    return `./packages/${this.name}`;
  }

  get src() {
    return `${this.dir}/src`;
  }

  get entry() {
    return `${this.src}/${this.name}.js`;
  }
}

const packages = [
  new PackageConfig({
    name: 'ffw',
    external: ['yup'],
  }),
  // {
  //   name: 'ffw',
  //   entry: './packages/ffw/src/index.js',
  // },
];

for (const {name, entry, dir, external} of packages) {
  await build({
    ...defineConfig({
      build: {
        target: 'esnext',
        outDir: `${dir}/dist`,
        name,
        lib: {
          fileName: name,
          entry: [entry],
          formats: ['es', 'cjs'],
        },
        rollupOptions: {
          external: external,
        },
      },
    }),
  });
}
