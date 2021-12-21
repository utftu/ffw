import {spawnAsync, exec} from './scripts/utils.js';

// exec('node ./test/a.cjs');
spawnAsync('node', ['./test/a.js']);
