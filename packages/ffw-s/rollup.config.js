import {dirname, join} from 'path';
import {fileURLToPath} from 'url';
import createRollupConfig from '../../scripts/create-rollup-config.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default createRollupConfig({
  inputDir: __dirname,
  outputDir: join(__dirname, 'dist'),
  config: {
    external: ['svelte']
  }
});

