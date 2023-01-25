import {exec} from './utils.js';

process.chdir('./packages/ffw');
exec('npm version patch');
exec(`pnpm publish --no-git-checks`);
process.chdir('../..');
process.chdir('./packages/ffw-react');
exec('npm version patch');
exec(`pnpm publish --no-git-checks`);
process.chdir('../..');
process.chdir('./packages/ffw-svelte');
exec('npm version patch');
exec(`pnpm publish --no-git-checks`);
process.chdir('../..');
process.chdir('./packages/ffw-solid');
exec('npm version patch');
exec(`pnpm publish --no-git-checks`);
process.chdir('../..');
