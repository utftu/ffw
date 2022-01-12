import path from 'path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

await import(path.join(__dirname, '../packages/ffw-base/build.js'));
await import(path.join(__dirname, '../packages/ffw/build.js'));
await import(path.join(__dirname, '../packages/ffw-s/build.js'));
