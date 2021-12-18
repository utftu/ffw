import typescript from '@rollup/plugin-typescript';
import {dirname, join} from 'path';
import {fileURLToPath} from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

export default {
  input: join(__dirname, './packages/ffw-base/index.ts'),
  output: {
    dir: 'dist',
    format: 'cjs'
  },
  plugins: [typescript({
    tsconfig: join(__dirname, './tsconfig.json'),
  })]
};