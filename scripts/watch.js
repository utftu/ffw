import {execAsync, spawnAsync} from './utils.js';
import {dirname} from 'path';
import path from 'path';
import {fileURLToPath} from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
setTimeout(() => {
  console.log(
    '-----',
    "path.join(__dirname, 'packages/ffw-base/rollup.config.js')",
    path.join(__dirname, 'packages/ffw-base/rollup.config.js')
  );
}, 5000);

console.log('ffw-base build start');
// execAsync(`rollup -c -w ./packages/ffw-base/rollup.config.js`);
spawnAsync('rollup', [
  '-c',
  '-w',
  path.join(__dirname, '../packages/ffw-base/rollup.config.js'),
]);
// console.log('ffw build start');
// execAsync(`rollup -c -w packages/ffw/rollup.config.js`);
// console.log('ffw-s build start');
// execAsync(`rollup -c -w packages/ffw-s/rollup.config.js`);
