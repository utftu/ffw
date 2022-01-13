import {exec} from './utils.js';

process.chdir('./packages/ffw-base');
exec('npm version patch');
exec(`pnpm publish --no-git-checks`);
process.chdir('../..');
process.chdir('./packages/ffw');
exec('npm version patch');
exec(`pnpm publish --no-git-checks`);
process.chdir('../..');
process.chdir('./packages/ffw-s');
exec('npm version patch');
exec(`pnpm publish --no-git-checks`);
process.chdir('../..');
