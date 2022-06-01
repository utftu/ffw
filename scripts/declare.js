import path from 'node:path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

await import(path.join(__dirname, '../packages/ffw-base/declare.js'));
await import(path.join(__dirname, '../packages/ffw/declare.js'));
await import(path.join(__dirname, '../packages/ffw-s/declare.js'));
