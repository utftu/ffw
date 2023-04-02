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
    external: [],
  }),
  new PackageConfig({
    name: 'ffw-nanostores',
    external: ['ffw', 'nanostores'],
  }),
  new PackageConfig({
    name: 'ffw-solid',
    external: ['ffw', 'solid-js'],
  }),
  new PackageConfig({
    name: 'ffw-svelte',
    external: ['ffw', 'svelte'],
  }),
  new PackageConfig({
    name: 'ffw-react',
    external: ['ffw', 'react'],
  }),
];

for (const {name, entry, dir, external} of packages) {
  await build({
    ...defineConfig({
      build: {
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
