import {execSync} from 'node:child_process';

console.log('-----', 'process.argv', process.argv);

const target = process.argv[2];

if (!target) {
  throw new Error('no target');
}

execSync(`cd ${target}`);
execSync('git add .');
execSync('git commit -m "fast publish"');
execSync('git push');
execSync('pnpm run test');

// execSync('cd -');
