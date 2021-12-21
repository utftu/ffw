import {execAsync} from './utils.js';

console.log('ffw-base build start');
execAsync(`rollup -c -w packages/ffw-base/rollup.config.js`);
console.log('ffw build start');
execAsync(`rollup -c -w packages/ffw/rollup.config.js`);
console.log('ffw-s build start');
execAsync(`rollup -c -w packages/ffw-s/rollup.config.ms`);
