import fs from 'fs';
import {babel} from '@rollup/plugin-babel';
import babelConfig from './babel.config.cjs';
import copy from 'rollup-plugin-copy';
import {terser} from 'rollup-plugin-terser';
import typescript from '@rollup/plugin-typescript';

import {dirname, join} from 'path';
import {fileURLToPath} from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const typescriptConfig = JSON.parse(
  fs.readFileSync(new URL('./tsconfig.json', import.meta.url)).toString()
);

console.log('-----', 'typescriptConfig', typescriptConfig);

const target = './dist';

const config = [
  {
    input: join(__dirname, './static/path.cjs'),
    output: {
      file: join(__dirname, `${target}/cjs/index.js`),
      format: 'cjs',
    },
    plugins: [
      copy({
        targets: [
          {
            src: join(__dirname, './static/package-cjs.json'),
            dest: join(__dirname, `./${target}/cjs`),
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
    input: join(__dirname, 'src/index.ts'),
    output: {
      file: join(__dirname, `${target}/${format}/${mode}.js`),
      format: format,
    },
    plugins: [
      typescript(),
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
