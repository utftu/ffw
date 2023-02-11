import esbuild from 'esbuild';
import path from 'node:path';
import fs from 'node:fs';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const entries = [
  {name: 'ffw', external: ['yup']},
  // {name: 'ffw-react', external: ['react', 'react-dom', 'yup']},
  // {name: 'ffw-svelte', external: ['svelte', 'yup']},
  // {name: 'ffw-solid', external: ['solid-js', 'yup']},
];

function formatPackageExpoerts(packageDir) {
  const packageJsonPath = path.join(packageDir, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath).toString());
  packageJson.exports = {
    '.': {
      development: {
        import: `./dist/esm/dev.js`,
        require: `./dist/cjs/dev.js`,
      },
      production: {
        import: `./dist/esm/prod.js`,
        require: `./dist/cjs/prod.js`,
      },
      import: `./dist/esm/prod.js`,
      require: `./dist/cjs/prod.js`,
    },
    './*': './*',
  };
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
}

for (const {name, external} of entries) {
  const packageDir = path.join(__dirname, '../packages', name);
  const packageEntry = path.join(packageDir, 'src/index.js');
  formatPackageExpoerts(packageDir);

  fs.cpSync(
    path.join(__dirname, '../static/package-cjs.json'),
    path.join(packageDir, 'dist/cjs/package.json'),
    {recursive: true}
  );
  fs.cpSync(
    path.join(__dirname, '../static/path.cjs'),
    path.join(packageDir, 'dist/cjs/index.js'),
    {recursive: true}
  );

  fs.cpSync(
    path.join(__dirname, '../static/path.cjs'),
    path.join(packageDir, 'dist/cjs/index.js'),
    {recursive: true}
  );

  esbuild.build({
    entryPoints: [packageEntry],
    bundle: true,
    format: 'esm',
    external,
    minify: true,
    platform: 'node',
    outfile: path.join(packageDir, 'dist/esm/prod.js'),
  });
  esbuild.build({
    entryPoints: [packageEntry],
    bundle: true,
    format: 'esm',
    minify: false,
    external,
    platform: 'node',
    outfile: path.join(packageDir, 'dist/esm/dev.js'),
    target: 'esnext',
  });
  esbuild.build({
    entryPoints: [packageEntry],
    bundle: true,
    format: 'cjs',
    external,
    minify: true,
    platform: 'node',
    outfile: path.join(packageDir, 'dist/cjs/prod.js'),
  });
  esbuild.build({
    entryPoints: [packageEntry],
    bundle: true,
    format: 'cjs',
    external,
    minify: false,
    platform: 'node',
    outfile: path.join(packageDir, 'dist/cjs/dev.js'),
  });
}
