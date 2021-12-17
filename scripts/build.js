import childProcess from 'child_process';
import path, {dirname} from 'path';
import {fileURLToPath} from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

const exec = (cmd, options) => {
  childProcess.execSync(cmd, {stdio: 'inherit', shell: true, ...options});
};

console.log('ffw-base build start');
exec(`npm run --prefix ${path.join(__dirname, '../packages/ffw-base')} build`);
// exec('rollup -c packages/ffw-base/rollup.config.mjs');
// console.log('ffw build start');
// exec('rollup -c packages/ffw/rollup.config.mjs');
// console.log('ffw-s build start');
// exec('rollup -c packages/ffw-s/rollup.config.mjs');
