import path from 'node:path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

await import(path.join(__dirname, '../packages/ffw/build.js'));
await import(path.join(__dirname, '../packages/ffw-react/build.js'));
await import(path.join(__dirname, '../packages/ffw-svelte/build.js'));
