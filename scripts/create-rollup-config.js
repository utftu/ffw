import copy from 'rollup-plugin-copy';
import typescript from '@rollup/plugin-typescript';
import {terser} from 'rollup-plugin-terser';

import {dirname, join} from 'path';
import {fileURLToPath} from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

export default function ({config, inputDir, outputDir}) {
  console.log(
    '-----',
    "join(__dirname, '../tsconfig.prod.json')",
    join(__dirname, '../tsconfig.prod.json')
  );
  return [
    {
      input: join(__dirname, './path.cjs'),
      output: {
        file: join(outputDir, '/cjs/index.js'),
        format: 'cjs',
      },
      plugins: [
        copy({
          targets: [
            {
              src: join(__dirname, './package-cjs.json'),
              dest: join(outputDir, 'cjs'),
              rename: 'package.json',
            },
          ],
        }),
      ],
    },
    ...[
      {formats: ['esm', 'cjs'], mode: 'dev'},
      {formats: ['esm', 'cjs'], mode: 'prod'},
    ].map(({formats, mode}) => ({
      input: join(inputDir, 'index.ts'),
      output: formats.map((format) => ({
        file: join(outputDir, `/${format}/${mode}.js`),
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
      // external: ['react', 'react-dom', 'react-native'],
      ...config,
    })),
  ];
}
