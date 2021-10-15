import {babel} from '@rollup/plugin-babel';
import babelConfig from './babel.config.cjs';
import copy from 'rollup-plugin-copy';
import {terser} from 'rollup-plugin-terser';

import {dirname, join} from 'path';
import {fileURLToPath} from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const config = [
  {
    input: join(__dirname, './static/path.cjs'),
    output: {
      file: join(__dirname, 'dist/cjs/index.js'),
      format: 'cjs',
    },
    plugins: [
      copy({
        targets: [
          {
            src: join(__dirname, './static/package-cjs.json'),
            dest: join(__dirname, './dist/cjs'),
            rename: 'package.json',
          },
        ],
      }),
    ],
  },
  ...[
    {format: 'esm', mode: 'dev'},
    {format: 'esm', mode: 'prod'},
    {format: 'cjs', mode: 'dev'},
    {format: 'cjs', mode: 'prod'},
  ].map(({format, mode}) => ({
    input: join(__dirname, 'src/index.js'),
    output: {
      file: join(__dirname, `dist/${format}/${mode}.js`),
      format: format,
    },
    plugins: [
      babel({
        babelHelpers: 'bundled',
        ...babelConfig,
      }),
      mode === 'prod' ? terser() : null,
    ],
    external: ['react'],
  })),
];

export default config;
