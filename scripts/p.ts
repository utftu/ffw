import {execSync} from 'node:child_process';

console.log('-----', 'process.argv', process.argv);

const target = process.argv[2];

if (!target) {
  throw new Error('no target');
}

console.log(execSync(`cd ${target}`).toString());
console.log(execSync('git add .').toString());
console.log(execSync('git commit -m "fast publish"').toString());

// execSync(`cd ${target}`);
// execSync('git add .');
// execSync('git commit -m "fast publish"');
// execSync('git push');
// execSync('pnpm run test');

// execSync('cd -');
