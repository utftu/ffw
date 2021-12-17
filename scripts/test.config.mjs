import copy from 'rollup-plugin-copy';
import {terser} from 'rollup-plugin-terser';
import typescript from '@rollup/plugin-typescript';

import {dirname, join} from 'path';
import {fileURLToPath} from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const target = './dist';

const config = [
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
  ...[
    {formats: ['esm', 'cjs'], mode: 'dev'},
    {formats: ['esm', 'cjs'], mode: 'prod'},
  ].map(({formats, mode}) => ({
    input: join(__dirname, '../packages/ffw/index.ts'),
    output: formats.map((format) => ({
      file: join(__dirname, `${target}/${format}/${mode}.js`),
      format: format,
    })),
    plugins: [
      typescript({
        tsconfig:
          mode === 'prod'
            ? join(__dirname, '../tsconfig.prod.json')
            : join(__dirname, '../tsconfig.json'),
      }),
      mode === 'prod' ? terser() : null,
    ],
    external: ['react', 'react-dom', 'react-native'],
  })),
];

export default config;
