import path, {dirname} from 'path';
import {fileURLToPath} from 'url';
import {exec} from './utils.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

console.log('ffw-base build start');
exec(
  `rollup -c ${path.join(__dirname, '../packages/ffw-base/rollup.config.js')}`
);
console.log('ffw build start');
exec(`rollup -c packages/ffw/rollup.config.js`);
console.log('ffw-s build start');
exec(`rollup -c packages/ffw-s/rollup.config.js`);
