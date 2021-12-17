// rollup.config.js
import typescript from '@rollup/plugin-typescript';

export default {
  input: './packages/ffw/index.ts',
  output: {
    dir: 'dist',
    format: 'cjs'
  },
  plugins: [typescript()]
};