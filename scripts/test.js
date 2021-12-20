import {exec} from 'child_process';
import {spawn} from 'child_process';
const result = exec('rollup -c -w packages/ffw-base/rollup.config.js');
result.stdout.pipe(process.stdout);
result.stderr.pipe(process.stderr);

// exec(
//   'echo "The \\$HOME variable is $HOME"',
//   {stdio: 'inherit', shell: true},
//   (...args) => {
//     console.log('-----', 'args', args);
//   }
// );
// The $HOME variable is escaped in the first
