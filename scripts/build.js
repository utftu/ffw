import {exec} from './utils.js';

console.log('ffw-base build start');
exec(`rollup -c packages/ffw-base/rollup.config.js`);
console.log('ffw build start');
exec(`rollup -c packages/ffw/rollup.config.js`);
console.log('ffw-s build start');
exec(`rollup -c packages/ffw-s/rollup.config.js`);
