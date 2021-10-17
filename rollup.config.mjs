import fs from 'fs';
import {babel} from '@rollup/plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
// import babelConfig from './babel.config.cjs';
import copy from 'rollup-plugin-copy';
import {terser} from 'rollup-plugin-terser';
import typescript from '@rollup/plugin-typescript';
import {getBabelOutputPlugin} from '@rollup/plugin-babel';

import path, {dirname, join} from 'path';
import {fileURLToPath} from 'url';

console.log('-----', '123');

const __dirname = dirname(fileURLToPath(import.meta.url));

const target = './dist';
const extensions = ['.ts', '.js'];

const config = [
  {
    input: join(__dirname, './src/test.ts'),
    output: {
      file: join(__dirname, `${target}/dist/test.js`),
      format: 'esm',
    },
    plugins: [
      // typescript()
      babel({
        babelHelpers: 'bundled',
        configFile: path.join(__dirname, './babel.config.cjs'),
        presets: ['@babel/preset-typescript'],
        extensions: ['.ts'],
      }),
    ],
  },
  // {
  //   input: join(__dirname, './static/path.cjs'),
  //   output: {
  //     file: join(__dirname, `${target}/cjs/index.js`),
  //     format: 'cjs',
  //   },
  //   plugins: [
  //     copy({
  //       targets: [
  //         {
  //           src: join(__dirname, './static/package-cjs.json'),
  //           dest: join(__dirname, `./${target}/cjs`),
  //           rename: 'package.json',
  //         },
  //       ],
  //     }),
  //   ],
  // },
  // ...[
  //   {format: 'esm', mode: 'dev'},
  //   {format: 'esm', mode: 'prod'},
  //   {format: 'cjs', mode: 'dev'},
  //   {format: 'cjs', mode: 'prod'},
  // ].map(({format, mode}) => ({
  //   input: join(__dirname, 'src/index.ts'),
  //   output: {
  //     file: join(__dirname, `${target}/${format}/${mode}.js`),
  //     format: format,
  //   },
  //   plugins: [
  //     // typescript({tsconfig: './tsconfig.prod.json'}),
  //     babel({
  //       configFile: './babel.config.prod.cjs',
  //       babelHelpers: 'bundled',
  //       extensions: ['.js', '.jsx', '.es6', '.es', '.mjs'],
  //     }),
  //     mode === 'prod' ? terser() : null,
  //   ],
  //   external: ['react'],
  // })),
];

export default config;
