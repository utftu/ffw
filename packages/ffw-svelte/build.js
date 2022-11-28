import esbuild from 'esbuild';
import fs from 'fs';
import textReplace from 'esbuild-plugin-text-replace';

function copyFile(source, target) {
  fs.cpSync(
    new URL(source, import.meta.url).pathname,
    new URL(target, import.meta.url).pathname,
    {
      recursive: true,
    }
  );
}

copyFile('../../static/package-cjs.json', './dist/cjs/package.json');
copyFile('../../static/path.cjs', './dist/cjs/index.js');

const externals = ['svelte', 'yup'];

const baseConfig = {
  entryPoints: [new URL('./src/index.js', import.meta.url).pathname],
  bundle: true,
  platform: 'node',
  external: externals,
  watch: !!process.env.WATCH,
};

const configs = [
  {
    format: 'esm',
    minify: true,
    outfile: new URL('./dist/esm/prod.js', import.meta.url).pathname,
    plugins: [
      textReplace({
        include: /.*/,
        pattern: [["from 'ffw'", "from 'ffw/dist/esm/prod.js'"]],
      }),
    ],
  },
  {
    format: 'esm',
    minify: false,
    outfile: new URL('./dist/esm/dev.js', import.meta.url).pathname,
    plugins: [
      textReplace({
        include: /.*/,
        pattern: [["from 'ffw'", "from 'ffw/dist/esm/prod.js'"]],
      }),
    ],
  },
  {
    format: 'cjs',
    minify: true,
    outfile: new URL('./dist/cjs/prod.js', import.meta.url).pathname,
    plugins: [
      textReplace({
        include: /.*/,
        pattern: [["from 'ffw'", "from 'ffw/dist/cjs/prod.js'"]],
      }),
    ],
  },
  {
    format: 'cjs',
    minify: false,
    outfile: new URL('./dist/cjs/dev.js', import.meta.url).pathname,
    plugins: [
      textReplace({
        include: /.*/,
        pattern: [["from 'ffw'", "from 'ffw/dist/cjs/dev.js'"]],
      }),
    ],
  },
];

configs.forEach((config) => {
  esbuild.build({
    ...baseConfig,
    ...config,
  });
});

// esbuild.build({
//   entryPoints: [path.join(__dirname, './src/index.js')],
//   bundle: true,
//   format: 'esm',
//   minify: true,
//   platform: 'node',
//   external: externals,
//   watch: !!process.env.WATCH,
//   outfile: path.join(__dirname, './dist/esm/prod.js'),
//   plugins: [
//     textReplace({
//       include: /.*/,
//       pattern: [["from 'ffw'", "from 'ffw/dist/esm/prod.js'"]],
//     }),
//   ],
// });

// esbuild.build({
//   entryPoints: [path.join(__dirname, './src/index.js')],
//   bundle: true,
//   format: 'esm',
//   minify: false,
//   platform: 'node',
//   external: externals,
//   watch: !!process.env.WATCH,
//   outfile: path.join(__dirname, './dist/esm/dev.js'),
//   plugins: [
//     textReplace({
//       include: /.*/,
//       pattern: [["from 'ffw'", "from 'ffw/dist/esm/dev.js'"]],
//     }),
//   ],
// });
//
// esbuild.build({
//   entryPoints: [path.join(__dirname, './src/index.js')],
//   bundle: true,
//   format: 'cjs',
//   minify: true,
//   platform: 'node',
//   external: externals,
//   watch: !!process.env.WATCH,
//   outfile: path.join(__dirname, './dist/cjs/prod.js'),
//   plugins: [
//     textReplace({
//       include: /.*/,
//       pattern: [["from 'ffw'", "from 'ffw/dist/cjs/prod.js'"]],
//     }),
//   ],
// });
//
// esbuild.build({
//   entryPoints: [path.join(__dirname, './src/index.js')],
//   bundle: true,
//   format: 'cjs',
//   minify: false,
//   platform: 'node',
//   external: externals,
//   watch: !!process.env.WATCH,
//   outfile: path.join(__dirname, './dist/cjs/dev.js'),
//   plugins: [
//     textReplace({
//       include: /.*/,
//       pattern: [["from 'ffw'", "from 'ffw/dist/cjs/dev.js'"]],
//     }),
//   ],
// });
